from plone import api
from plone.app.upgrade.utils import loadMigrationProfile

import logging

default_profile = 'profile-rohberg.expertsearch:default'
logger = logging.getLogger(__name__)


def reload_gs_profile(context):
    loadMigrationProfile(
        context,
        'profile-rohberg.expertsearch:default',
    )


def upgrade_region_field(context=None):
    setup = api.portal.get_tool('portal_setup')
    setup.runImportStepFromProfile(default_profile, 'controlpanel')

    # setup.runImportStepFromProfile(default_profile, 'catalog')
    # for brain in api.content.find(portal_type='talk'): # TODO behavior interface
    #     obj = brain.getObject()
    #     obj.reindexObject(idxs=[
    #     'region',
    #     ])
        