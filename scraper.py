import datetime
from os import environ
import re

import requests
from icalendar import Calendar
# hack to override sqlite database filename
# see: https://help.morph.io/t/using-python-3-with-morph-scraperwiki-fork/148
environ['SCRAPERWIKI_DATABASE_NAME'] = 'sqlite:///data.sqlite'
import scraperwiki


url = 'https://calendar.google.com/calendar/ical/7phgh51gv2gnm4jqigj8qaf06g%40group.calendar.google.com/private-684722edc06482cf6c23aab108ca192d/basic.ics'
r = requests.get(url)

gcal = Calendar.from_ical(r.text)
location_re = re.compile(r'[\d\., -]+')
home = [{
    'id': x['UID'].split('@')[0],
    'date': x['DTEND'].dt if type(x['DTEND'].dt) == datetime.date else x['DTEND'].dt.date(),
    'location': x['SUMMARY'].split(' to ')[1] if ' to ' in x['SUMMARY'] else '',
    'journey': str(x['SUMMARY']),
    'lat': str(x['LOCATION']).split(',')[0],
    'lng': str(x['LOCATION']).split(',')[1].strip(),
} for x in gcal.walk() if x.name == 'VEVENT' and location_re.match(x['LOCATION'])]

home = sorted(home, key=lambda x: x['date'])

scraperwiki.sqlite.save(['id'], home, 'home')
