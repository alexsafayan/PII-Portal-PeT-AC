from django.conf.urls import url
from django.urls import path

from backend import views 
#need to add the ability to return individual emails
urlpatterns = [ 
    url(r'^api/emails$', views.get_email),
    url(r'^api/crawlEmail$', views.search_surfaceWeb_email),
    url(r'^api/subscribe$', views.email_subscribe),
    url(r'^api/names$', views.get_nameAndZip),
    url(r'^api/crawl$', views.search_surfaceWeb_nameAndZip),
    url(r'^api/resolve$', views.resolve_entities)
]