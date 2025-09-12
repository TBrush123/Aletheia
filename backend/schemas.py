from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# -- Answers --
class AnswerCreate(BaseModel):
    question_id: int
    response_id: int
    text: str


class AnswerOut(BaseModel):
    id: int
    question_id: int
    response_id: int
    answer_text: str

    class Config:
        orm_mode = True


# -- Questions --
class QuestionCreate(BaseModel):
    text: str
    poll_id: int


class QuestionOut(BaseModel):
    id: int
    text: str
    poll_id: int

    class Config:
        orm_mode = True


# -- Polls --
class PollCreate(BaseModel):
    title: str
    creator_id: int


class PollOut(BaseModel):
    id: int
    title: str
    creator_id: int
    created_by: Optional[str] = "Unknown"
    response_count: Optional[int] = 0
    question_count: Optional[int] = 0

    class Config:
        orm_mode = True


# -- Users --
class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True

# -- Response --
class ResponseCreate(BaseModel):
    responder_id: int
    poll_id: int

class ResponseOut(BaseModel):
    id: int
    responder_id: int
    poll_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# -- AI Response --
class AIResponseCreate(BaseModel):
    poll_id: int
    positive_feedback: str
    negative_feedback: str
    suggestions_for_improvement: str

class AIResponseOut(BaseModel):
    id: int
    poll_id: int
    positive_feedback: str
    negative_feedback: str
    suggestions_for_improvement: str

    class Config:
        orm_mode = True