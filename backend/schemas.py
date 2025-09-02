from pydantic import BaseModel
from typing import List, Optional


# -- Answers --
class AnswerCreate(BaseModel):
    question_id: int
    responder_id: int
    text: str


class AnswerOut(BaseModel):
    id: int
    question_id: int
    responder_id: int
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
