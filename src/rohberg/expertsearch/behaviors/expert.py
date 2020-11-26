# -*- coding: utf-8 -*-

from collective import dexteritytextindexer
from rohberg.expertsearch import _
from plone import schema
from plone.autoform.directives import widget
from plone.autoform.interfaces import IFormFieldProvider
from plone.supermodel import model
from Products.CMFPlone.utils import safe_hasattr
from z3c.form.browser.radio import RadioFieldWidget
from zope.component import adapter
from zope.interface import Interface
from zope.interface import implementer
from zope.interface import provider


class IExpertMarker(Interface):
    pass


@provider(IFormFieldProvider)
class IExpert(model.Schema):
    """
    """

    dexteritytextindexer.searchable('competence')
    # dexteritytextindexer.searchable('region') # extra index for filtering by region
    dexteritytextindexer.searchable('organisation')

    competence = schema.TextLine(
        title=_(u'Competence'),
        required=False,
    )
    region = schema.TextLine(
        title=_(u'Region'),
        required=False
    )
    organisation = schema.TextLine(
        title=_(u'Organisation'),
        required=False,
    )
    widget(is_expert=RadioFieldWidget)
    is_expert = schema.Bool(
        title=_(u'Ist Experte. In Expertensuche aufnehmen.'),
        default=True,
        required=False,
    )


@implementer(IExpert)
@adapter(IExpertMarker)
class Expert(object):
    def __init__(self, context):
        self.context = context

    @property
    def competence(self):
        if safe_hasattr(self.context, 'competence'):
            return self.context.competence
        return None

    @competence.setter
    def competence(self, value):
        self.context.competence = value

    @property
    def region(self):
        if safe_hasattr(self.context, 'region'):
            return self.context.region
        return None

    @region.setter
    def region(self, value):
        self.context.region = value

    @property
    def organisation(self):
        if safe_hasattr(self.context, 'organisation'):
            return self.context.organisation
        return None

    @organisation.setter
    def organisation(self, value):
        self.context.organisation = value

    @property
    def is_expert(self):
        if safe_hasattr(self.context, 'is_expert'):
            return self.context.is_expert
        return None

    @is_expert.setter
    def is_expert(self, value):
        self.context.is_expert = value
