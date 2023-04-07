import json
import datetime
from flask import g
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.declarative import DeclarativeMeta
from sqlalchemy.orm import sessionmaker

class SQLAlchemyEncoder(json.JSONEncoder):
    def default(self, model):
        if isinstance(model.__class__, DeclarativeMeta):
            return {c.name: getattr(model, c.name) for c in model.__table__.columns}
        elif isinstance(model, datetime.datetime):
            return model.timestamp()
        return json.JSONEncoder.default(self, model)


# Create the engine and connect to the database
engine = create_engine('sqlite:///example.db', echo=True)
Session = sessionmaker(bind=engine)
Base = declarative_base()

class BaseExtension:
    @classmethod
    def create(cls, *args, **kwargs):
        model = cls(**kwargs)
        g.session.add(model)
        g.session.commit()
        return model

    @classmethod
    def find(cls, id):
        return g.session.query(cls).filter_by(id=id).first()

    @classmethod
    def find_all(cls):
        return g.session.query(cls).all()

    @classmethod
    def filter(cls, func):
        return g.session.query(cls).filter(func(cls)).all()

    @classmethod
    def save(cls):
        g.session.commit()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        g.session.commit()
        return self

    def __repr__(self):
        return {}

# Define the Product class
class Product(Base, BaseExtension):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True)
    quantity = Column(Integer)
    name = Column(String)
    date = Column(DateTime)
    price = Column(Float)
    weight = Column(Float)
    size = Column(String)
    image = Column(String)


# Define the Order class
class Order(Base, BaseExtension):
    __tablename__ = 'orders'
    id = Column(String, primary_key=True)
    email = Column(String)
    date = Column(DateTime)
    address = Column(String)
    fee = Column(Float)
    price = Column(Float)
    profit = Column(Float)
    label = Column(Float)
    is_processed = Column(Boolean)
    is_shipped = Column(Boolean)

# Create the tables in the database
Base.metadata.create_all(engine)