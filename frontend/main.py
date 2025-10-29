import flet as ft
import os
# Importamos la función que crea la vista login (src.views.login_views)
from src.views.login_views import create_login_view 

def main(page: ft.Page):
    page.title = "NeuroVision" # Título de la página
    page.bgcolor = "#EBEBEB" #El color de fondo de la página
    
    # Comando para accesar a la carpeta assets
    script_dir = os.path.dirname(os.path.abspath(__file__))
    assets_path = os.path.join(script_dir, "assets")
    page.assets_dir = assets_path

    # Creamos la vista de login llamando a la función
    login_view_content = create_login_view()

    # Usamos un Contenedor principal para centrar la vista en la página
    centered_container = ft.Container(
        content=login_view_content,
        alignment=ft.alignment.center,
        expand=True # Hace que el contenedor ocupe toda la página
    )
    
    # Añadimos el contenedor centrxado a la página
    page.add(centered_container)
    page.update()

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