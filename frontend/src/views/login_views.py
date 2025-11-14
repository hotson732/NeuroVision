# src/views/login_views.py
import flet as ft
from src.views.upload_images import create_upload_images_view
# Crea la vista de login completa
def create_login_view(page):
    """
    Crea la vista de login completa, basada en el diseño de Figma.
    """
    def on_login_click(e):
        page.clean()
        upload_view = create_upload_images_view(page)
        page.add(upload_view)
        page.update()
    # Logo NeuroVision:

    logo_image = ft.Image(
        src="logo.png", 
        width=450,
        height=450,
        fit=ft.ImageFit.CONTAIN
    )

    # Columna Izquierda, (con logo y disclaimer):

    left_column = ft.Container(
        content=ft.Column(
            controls=[
                logo_image,
                ft.Container(height=12),
                ft.Text(
                    "Este es un disclaimer breve debajo del logo.",
                    size=12,
                    color = 'white',
                    font_family = 'Inter',
                    weight=ft.FontWeight.W_800
                )
            ],
            alignment=ft.MainAxisAlignment.CENTER,
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            spacing = 0
        ),
        alignment=ft.alignment.center,
        width=500,
        height=650,
        bgcolor="#0A072E", 
        border_radius=ft.border_radius.all(18),
        padding=20
    )

    # Columna Derecha (Formulario de Login)
    
    # Botón Usuario:

    username_field = ft.TextField(
        label="Usuario", 
        width=320,
        border=ft.InputBorder.OUTLINE,
        border_radius=ft.border_radius.all(9),

        label_style=ft.TextStyle(
            color = '#626262',
            font_family = 'Inter',
            weight = ft.FontWeight.W_600

        )
    )

    # Campo de texto para la contraseña:

    password_field = ft.TextField(
        label="Contraseña", 
        password=True,
        color = '#626262',
        can_reveal_password=True, 
        width=320,
        border=ft.InputBorder.OUTLINE,
        border_radius=ft.border_radius.all(8),

    # Definimos estilo del texto:

    text_style=ft.TextStyle(
        font_family = 'Inter',
        weight = ft.FontWeight.W_600
    ),
    # Definimos estilo de la etiqueta:

    label_style=ft.TextStyle(
        color = '#626262',
        font_family = 'Inter',
        weight = ft.FontWeight.W_600
    )
)
    # Botón Iniciar Sesión:
    login_button = ft.ElevatedButton(
    text="Iniciar Sesión",
    bgcolor="#1B33E7", 
    color="white",  
    width=320,
    height=45,
    on_click=on_login_click,
    style=ft.ButtonStyle(
        shape=ft.RoundedRectangleBorder(radius=8),
        text_style=ft.TextStyle(
            font_family = 'Inter',
            size=16,               # Tamaño de la letra
            weight=ft.FontWeight.BOLD #Grosor
        )
    )
)
    #Botón Registrarse:
    
    register_button = ft.OutlinedButton(
    text="Registrarse",
    width=320,
    height=45,
    
    style=ft.ButtonStyle(
        shape=ft.RoundedRectangleBorder(radius=8),
        color='#919191',
         

        text_style=ft.TextStyle(
            font_family="Inter", 
            size=16,               # Tamaño de la letra
            weight=ft.FontWeight.BOLD  # Grosor 
        )
    )
)
    form_column = ft.Column(
        controls=[
            ft.Text("Bienvenido", size=18, color="#434343", weight=ft.FontWeight.W_900, font_family='Inter'),
            ft.Text("Iniciar Sesión", size=40, weight=ft.FontWeight.W_900, color="#434343", font_family = 'Inter'),
            ft.Container(height=10),
            username_field,
            password_field,
            ft.Container(height=10),
            login_button,
            register_button
        ],
        alignment=ft.MainAxisAlignment.START,
        horizontal_alignment=ft.CrossAxisAlignment.CENTER,
        spacing=18 
    )
    # Columna derecha (Form Iniciar Sesión):

    right_column = ft.Container(
        content=form_column,
        width=450,
        height=550,
        bgcolor="#CFCFCF",
        border_radius=ft.border_radius.all(18),
        padding=ft.padding.symmetric(horizontal=40, vertical=60)
    )

    # Fila Principal que combina ambas columnas:

    main_row = ft.Row(
        controls=[
            left_column,
            right_column
        ],
        alignment=ft.MainAxisAlignment.CENTER,
        vertical_alignment=ft.CrossAxisAlignment.CENTER,
        spacing=80
    )

    #Footer:

    footer = ft.Text(
       "© 2025 NeuroVision. Todos los derechos reservados.",
       size=11,
       color='#434343',
       font_family='Inter' 
    )
    main_column = ft.Column(
        controls=[
            main_row,
            ft.Container(height=18),
            footer
        ],
        alignment=ft.MainAxisAlignment.CENTER,
        horizontal_alignment=ft.CrossAxisAlignment.CENTER,
        spacing= 0
    )
    return main_column
