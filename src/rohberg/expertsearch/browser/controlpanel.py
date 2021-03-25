from plone.app.registry.browser.controlpanel import (
    ControlPanelFormWrapper,
    RegistryEditForm,
)
from plone.autoform import directives
from plone.restapi.controlpanels import RegistryConfigletPanel
from plone.z3cform import layout
from zope import schema
from zope.component import adapter
from zope.interface import Interface


class IExpertsearchControlPanel(Interface):

    region = schema.List(
        title='Region',
        default=['Zürich Stadt'],
        missing_value=[],
        required=False,
        value_type=schema.TextLine(),
    )


@adapter(Interface, Interface)
class ExpertsearchControlPanel(RegistryConfigletPanel):
    schema = IExpertsearchControlPanel
    schema_prefix = 'rohbergexpertsearch'
    configlet_id = 'rohbergexpertsearch-controlpanel'
    configlet_category_id = 'General'
    title = 'Expertsearch Settings'
    group = 'Products'


class ExpertsearchControlPanelForm(RegistryEditForm):
    schema = IExpertsearchControlPanel
    schema_prefix = 'rohbergexpertsearch'
    label = 'Expertsearch Settings'

ExpertsearchControlPanelView = layout.wrap_form(
    ExpertsearchControlPanelForm, ControlPanelFormWrapper)
