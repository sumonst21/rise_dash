import requests
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView

from dashboard import appmachine_api


class ListForms(APIView):
    """
    View to fetch list of available forms from the appmachine api
    """

    def get(self, request):
        forms = appmachine_api.fetch_forms()

        return Response(data={'result': forms})


class FormData(APIView):
    """
    List all entries for a particular form Id.
    """

    def get(self, request, form_id):
        formatted_data = appmachine_api.fetch_form_responses(form_id)
        return Response(data=formatted_data)