# Deploying to AWS EC2

This walks through getting ContractIQ running on a real EC2 instance,
step by step. You'll run all commands yourself in the AWS Console and
your own terminal — nothing here requires sharing AWS credentials.

## 1. Create an AWS account

1. Go to https://aws.amazon.com/ and click "Create an AWS Account".
2. You'll need an email, a credit/debit card (for identity verification —
   the instance size below stays within or very close to the free tier),
   and phone verification.
3. Once signed up, sign in to the **AWS Console**.

## 2. Launch an EC2 instance

1. In the AWS Console, search for **EC2** and open it.
2. Click **Launch Instance**.
3. **Name**: `contractiq`.
4. **AMI**: Ubuntu Server 24.04 LTS (should be pre-selected/easy to find).
5. **Instance type**: start with `t2.micro` or `t3.micro` (free-tier
   eligible, 1 GiB RAM) if you want to stay free — see "Cost and free
   tier" below. This app loads several ML models at once (torch,
   transformers, sentence-transformers, spaCy) which makes 1 GiB tight,
   so if it struggles (crashes, runs out of memory), resize to
   `t3.small` (2 GiB, ~$15-17/month) via the EC2 console — no need to
   redo the whole setup, just stop the instance, change instance type,
   start it again.
6. **Key pair**: click "Create new key pair", name it `contractiq-key`,
   download the `.pem` file, and keep it somewhere safe — you need it to
   SSH in, and AWS won't let you download it again.
7. **Network settings**: click "Edit" and add these inbound rules
   (besides the default SSH one):
   - HTTP, port 80, source: Anywhere
   - Custom TCP, port 8000, source: Anywhere (backend API)
   - Custom TCP, port 5173, source: Anywhere (frontend, if not proxying through 80)
8. **Storage**: bump to 16 GiB (default 8 GiB is tight once torch and
   the ML models are installed).
9. Click **Launch Instance**.

## 3. Connect to the instance

Once it's running (a minute or two), find its **Public IPv4 address** on
the instance's detail page. Then, from a terminal on your machine:

```bash
chmod 400 path/to/contractiq-key.pem
ssh -i path/to/contractiq-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
```

## 4. Install Docker on the instance

Run these on the EC2 instance (after SSHing in):

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-v2 git
sudo usermod -aG docker ubuntu
newgrp docker
```

## 5. Get the code onto the instance

```bash
git clone https://github.com/pragathi2006/ContractIQ.git
cd ContractIQ
cp .env.example .env
nano .env
```

In `.env`, set a real `JWT_SECRET_KEY`:

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

Paste that value in for `JWT_SECRET_KEY`. Add `PINECONE_API_KEY` too if
you want semantic search working (optional — the app works fine without
it, that feature just won't return results).

Also set `CORS_ORIGINS` to include your instance's actual public IP —
without this, the browser will block login/API requests with a CORS
error once you open the deployed frontend:

```
CORS_ORIGINS=http://localhost:5173,http://<YOUR_EC2_PUBLIC_IP>:5173
```

## 6. Start the backend

```bash
docker compose up -d --build
```

This builds and starts Redis, the API, and the Celery worker. First
build takes a while (installing torch, transformers, spaCy, etc.) —
expect 10-20 minutes depending on instance size. Check it's healthy:

```bash
docker compose ps
curl http://localhost:8000/
```

## 7. Build and serve the frontend

```bash
cd frontend
sudo apt-get install -y nodejs npm
npm install
```

Point the frontend at the EC2 instance's own public IP instead of
`localhost` — create `frontend/.env`:

```bash
echo "VITE_API_URL=http://<YOUR_EC2_PUBLIC_IP>:8000" > .env
npm run build
```

Serve the built static site:

```bash
npm install -g serve
serve -s dist -l 5173
```

(For a longer-lived deployment, run this under `pm2` or as a `systemd`
service instead of a foreground terminal, so it survives you logging
out and the instance rebooting.)

## 8. Open it

Visit `http://<YOUR_EC2_PUBLIC_IP>:5173` in a browser. Register an
account and try uploading a contract.

## Updating after a redeploy

Whenever you push new code to GitHub:

```bash
ssh -i contractiq-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
cd ContractIQ
git pull
docker compose up -d --build
cd frontend && npm run build
```

(`serve` will pick up the new `dist/` automatically if it's still
running; restart it if not.)

## Reliability: will the link stay up?

Both containers (`api`, `worker`) and Redis now have `restart:
unless-stopped` set in `docker-compose.yml` — if a container crashes
(e.g. an out-of-memory kill on a small instance) or the EC2 instance
reboots, Docker brings them back up automatically. You don't need to
babysit it, but a low-RAM instance (see below) is still more likely to
hit memory pressure under load than a bigger one.

## Cost and free tier

- `t2.micro`/`t3.micro` (1 GiB RAM) is free-tier eligible: up to 750
  hours/month free for your first 12 months on AWS. A single instance
  running continuously (~730 hrs/month) fits within that. This app's ML
  dependencies (torch, transformers, spaCy) make 1 GiB tight, but it's
  worth trying free before paying for anything.
- `t3.small` (2 GiB RAM, not free-tier) costs roughly $15-17/month
  running continuously — more headroom, easier to recommend if the
  micro instance struggles.
- **Stopping** the instance (not terminating — stopping preserves it,
  you just don't get billed for compute while it's off) is safe and
  free, but its public IP changes on restart unless you allocate an
  **Elastic IP** (free while attached to a *running* instance; a small
  hourly charge if left allocated while the instance is stopped — release
  it if you stop the instance for a long stretch, or just don't bother
  with an Elastic IP if a stable link isn't important to you).
- Set a billing alert as a safety net regardless: **Billing → Budgets →
  Create budget**, e.g. "notify me if spend exceeds $5".
