from django.conf.urls import url
from django.urls import path
from backend import views 

urlpatterns = [ 
    url(r'^api/emails$', views.query_email),
    url(r'^api/names$', views.query_nameAndZip),
    url(r'^api/crawlEmail$', views.crawl_pse_email),
    url(r'^api/crawl$', views.crawl_pse_nameAndZip),
    url(r'^api/resolve$', views.resolve_entities),
    url(r'^api/subscribe$', views.email_subscribe)
]