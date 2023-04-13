import datetime
import json
from flask import g
from sqlalchemy import create_engine, Column, JSON, Integer, String, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.declarative import DeclarativeMeta
from sqlalchemy.orm import sessionmaker


# Create the engine and connect to the database
engine = create_engine('sqlite:///data/store.db', echo=True)
Session = sessionmaker(bind=engine)
Base = declarative_base()


class SQLAlchemyEncoder(json.JSONEncoder):
    '''Define an encoder model that handles dates and sqlalchemy models.'''
    def default(self, model):
        if isinstance(model.__class__, DeclarativeMeta):
            return {c.name: getattr(model, c.name) for c in model.__table__.columns}
        elif isinstance(model, datetime.datetime):
            return model.timestamp()
        return json.JSONEncoder.default(self, model)


class BaseExtension:
    '''Define a set of functions to extend the base sqlalchemy model.'''
    @classmethod
    def create(cls, *args, **kwargs):
        '''Create a new model of own type with parameters.'''
        model = cls(**kwargs)
        g.session.add(model)
        return model

    @classmethod
    def find(cls, id):
        '''Return instance of model of own type by id.'''
        return g.session.query(cls).filter_by(id=id).first()

    @classmethod
    def find_all(cls):
        '''Return list of models of own type.'''
        return g.session.query(cls).all()

    @classmethod
    def filter(cls, func):
        '''Return list of models of own type filtered by expression.'''
        return g.session.query(cls).filter(func(cls)).all()

    def update(self, **kwargs):
        '''Update model of own type with parameters.'''
        for key, value in kwargs.items():
            setattr(self, key, value)
        return self


class Product(Base, BaseExtension):
    '''Product table contains information for item for sale in store.'''
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    date = Column(DateTime)
    category = Column(String) # photography | pottery | painting
    quantity = Column(Integer)
    price = Column(Float)
    weight = Column(Float)
    size = Column(String)
    image = Column(String)


class Order(Base, BaseExtension):
    '''Order table contains information on uncomplete, complete orders from store.'''
    __tablename__ = 'orders'

    id = Column(String, primary_key=True)
    email = Column(String)
    date = Column(DateTime)
    address = Column(String)
    net_profit = Column(Float)
    paypal_fee = Column(Float)
    order_price = Column(Float)
    label_price = Column(Float)
    label_service = Column(String)
    tracker = Column(String)
    products = Column(JSON)
    weight = Column(Float)
    shipment = Column(String)
    is_processed = Column(Boolean)
    is_shipped = Column(Boolean)
    shipping_date = Column(DateTime)
    shipping_number = Column(String)

# Create the tables in the database
Base.metadata.create_all(engine)