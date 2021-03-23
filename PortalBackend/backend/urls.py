from django.conf.urls import url
from django.urls import path

from backend import views 
#need to add the ability to return individual emails
urlpatterns = [ 
    url(r'^api/emails$', views.email_list),
    #url(r'^api/emails/(?P<pk>[0-9]+)$', views.email_detail),
    url(r'^api/subscribe$', views.email_subscribe),
    url(r'^api/name$', views.name_detail),
    url(r'^api/names$', views.name_detail),
    url(r'^api/crawl$', views.searchSurfaceWeb),
    url(r'^api/crawlEmail$', views.searchSurfaceWebEmail),
    url(r'^api/resolve$', views.resolve_entities),
    url(r'^api/resolveEmail$', views.resolve_entitiesEmail)
]