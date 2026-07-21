import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc
from sqlalchemy.orm import Session

from src.auth import get_current_user
from src.db import get_db
from src.models import Contract, User
from src.schemas import ContractDetail, ContractSummary

router = APIRouter(prefix="/contracts", tags=["Contracts"])


@router.get("", response_model=list[ContractSummary])
def list_contracts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    contracts = (
        db.query(Contract)
        .filter(Contract.user_id == current_user.id)
        .order_by(desc(Contract.created_at))
        .all()
    )

    return contracts


@router.get("/{contract_id}", response_model=ContractDetail)
def get_contract(
    contract_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    contract = (
        db.query(Contract)
        .filter(Contract.id == contract_id, Contract.user_id == current_user.id)
        .first()
    )

    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found.",
        )

    result = json.loads(contract.result_json) if contract.result_json else None

    return ContractDetail(
        id=contract.id,
        task_id=contract.task_id,
        filename=contract.filename,
        status=contract.status,
        risk_level=contract.risk_level,
        risk_score=contract.risk_score,
        created_at=contract.created_at,
        error=contract.error,
        result=result,
    )
