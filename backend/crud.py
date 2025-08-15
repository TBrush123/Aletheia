from sqlalchemy.orm import Session
from . import models, schemas


def create_poll(db: Session, poll: schemas.PollCreate):

    poll_model = models.Poll(title=poll.title, creator_id=poll.creator_id)

    db.add(poll_model)
    db.flush()

    for question in poll.questions:
        db.add(models.Question(poll_id=poll_model.id, text=question.text))

    db.commit()
    db.refresh(poll_model)
    return poll_model


def get_poll(db: Session, poll_id: int):

    return db.query(models.Poll).filter(models.Poll.id == poll_id).first()


def get_polls(db: Session, skip: int = 0, limit: int = 10):

    return db.query(models.Poll).offset(skip).limit(limit).all()


def create_answer(db: Session, answer: schemas.AnswerCreate):

    answer_model = models.Answer(**answer.model_dump())  # ???
    db.add(answer_model)
    db.commit()
    db.refresh(answer_model)

    return answer_model


def get_answers_for_poll(db: Session, poll_id: int):

    return (
        db.query(models.Answer)
        .join(models.Question)
        .filter(models.Question.poll_id == poll_id)
        .all()
    )


def create_user(db: Session, user: schemas.UserCreate):

    user_model = models.User(username=user.username, password=user.password)
    db.add(user_model)
    db.commit()
    db.refresh(user_model)

    return user_model


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

