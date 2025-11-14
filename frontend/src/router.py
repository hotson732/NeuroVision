from src.views.login_views import create_login_view 
from src.views.upload_images import create_upload_images_view

class Router:
    def __init__(self, page):
        self.page = page
    
    def navigate_to(self, route):
        self.page.clean()

        if route == "/login":
            view = create_login_view(self.page)
        elif route == "/upload":
            view = create_upload_images_view(self.page)
        else:
            view = create_login_view(self.page)
        
        self.page.add(view)
        self.page.update()
        