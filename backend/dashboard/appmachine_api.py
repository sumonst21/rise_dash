import numbers
from collections import defaultdict

import requests

from django.conf import settings

# HEADERS = {
#     'AM-AppKey': settings.APP_MACHINE_API_KEY,
#     'AM-ClientKey': settings.APP_MACHINE_CLIENT_KEY
# }


class AppMachineError(Exception):
    pass


def fetch_forms():
    HEADERS = {
        'AM-AppKey': settings.APP_MACHINE_API_KEY,
        'AM-ClientKey': settings.APP_MACHINE_CLIENT_KEY
    }

    response = requests.get(
        url=f'{settings.APP_MACHINE_URL}/data',
        headers=HEADERS
    )
    try:
        response.raise_for_status()
    except requests.HTTPError:
        raise AppMachineError(f'request failed: {response.content} using {HEADERS}')

    forms = [item for item in response.json()['result'] if item.get('type') == 'Form']

    return forms


def fetch_form_responses(form_id):
    HEADERS = {
        'AM-AppKey': settings.APP_MACHINE_API_KEY,
        'AM-ClientKey': settings.APP_MACHINE_CLIENT_KEY
    }
    
    response = requests.get(
        url=f'{settings.APP_MACHINE_URL}/data/{form_id}',
        headers=HEADERS
    )
    try:
        response.raise_for_status()
    except requests.HTTPError:
        raise AppMachineError(f'request failed: {response.content}')

    data = response.json()
    return format_data(data)


def format_data(data):
    """
    Takes the unformated response data of the api response and categorises the answers
    if possible.

    Will return a dictionary of categories with the results for each question below
    these. The format should mean less formatting needed in the frontend.
    """

    for response in data:
            for question, answer in list(response.items())[3:5]:
                response[f'participation_{question}'] = answer
                del response[question]

    return data
