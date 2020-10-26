from django.conf.urls import url 
from backend import views 
#need to add the ability to return individual emails
urlpatterns = [ 
    url(r'^api/emails$', views.email_list),
    url(r'^api/emails/(?P<pk>[0-9]+)$', views.email_detail)
]