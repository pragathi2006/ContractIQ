import logging
import os

# Create logs folder
os.makedirs("logs", exist_ok=True)

# Configure logging
logging.basicConfig(
    filename="logs/contractiq.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# Create logger
logger = logging.getLogger("ContractIQ")