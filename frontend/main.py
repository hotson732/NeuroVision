import flet as ft
import os
from src.router import Router
# Importamos la función que crea la vista login (src.views.login_views)



def main(page: ft.Page):
    page.title = "NeuroVision" # Título de la página
    page.bgcolor = "#EBEBEB" #El color de fondo de la página
    
    # Comando para accesar a la carpeta assets
    script_dir = os.path.dirname(os.path.abspath(__file__))
    assets_path = os.path.join(script_dir, "assets")
    page.assets_dir = assets_path

    # Creamos la vista de login llamando a la función
    router = Router(page)

    router.navigate_to("/login")
class MedicalApp:
    def __init__(self):
        self.backend_url = os.environ.get("BACKEND_URL", "http://backend:5000")

if __name__ == "__main__":
    ft.app(
        target=main,
        view=ft.AppView.WEB_BROWSER,
        port=8000,
        host="0.0.0.0"
    )