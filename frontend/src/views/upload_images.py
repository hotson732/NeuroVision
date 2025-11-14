#src/views/upload_images.py

def create_upload_images_view(page):
    """Crea la vista de subida de imágenes con diseño profesional y responsivo."""

    import flet as ft
    from flet import Icons

    # Paleta de colores profesional
    PRIMARY_COLOR = "#0B2163"
    SECONDARY_COLOR = "#00A3FF"
    SUCCESS_COLOR = "#77B800"
    WARNING_COLOR = "#C9A300"
    DANGER_COLOR = "#FF5252"
    LIGHT_BG = "#F5F7FA"
    CARD_BG = "#FFFFFF"
    TEXT_PRIMARY = "#1A1A1A"
    TEXT_SECONDARY = "#6B7280"
    BORDER_COLOR = "#E5E7EB"

    # Estado compartido
    preview_image = ft.Container(
        width=360,
        height=360,
        bgcolor="#FFFFFF",
        border_radius=ft.border_radius.all(12),
        alignment=ft.alignment.center,
        content=ft.Column(
            controls=[
                ft.Icon(Icons.IMAGE_NOT_SUPPORTED, size=80, color="#D1D5DB"),
                ft.Text(
                    "Sin imagen",
                    size=16,
                    color="#9CA3AF",
                    text_align=ft.TextAlign.CENTER
                )
            ],
            alignment=ft.MainAxisAlignment.CENTER,
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            spacing=10
        )
    )
    filename_text = ft.Text("", size=12, color=TEXT_SECONDARY, italic=True)

    # Campos del formulario con estilos mejorados
    def create_text_field(label, multiline=False, height=None):
        return ft.TextField(
            label=label,
            width=360,
            height=height,
            multiline=multiline,
            min_lines=1 if multiline else None,
            border=ft.InputBorder.OUTLINE,
            border_radius=ft.border_radius.all(8),
            border_color=BORDER_COLOR,
            filled=True,
            fill_color="#FAFBFC",
            label_style=ft.TextStyle(size=12, color=TEXT_SECONDARY),
            text_style=ft.TextStyle(size=13, color=TEXT_PRIMARY),
        )

    id_field = create_text_field("ID Paciente")
    name_field = create_text_field("Nombre Paciente")
    study_field = create_text_field("Tipo de Estudio")
    date_field = create_text_field("Fecha Análisis")
    notes_field = create_text_field("Notas del Médico", multiline=True, height=120)

    # Handlers
    def on_file_picker_result(e: ft.FilePickerResultEvent):
        if e.files and len(e.files) > 0:
            f = e.files[0]
            try:
                # Crear imagen desde la ruta del archivo
                image = ft.Image(
                    src=f.path,
                    width=360,
                    height=360,
                    fit=ft.ImageFit.CONTAIN
                )
                preview_image.content = image
            except Exception:
                if hasattr(f, "read_bytes"):
                    try:
                        b = f.read_bytes()
                        import base64
                        image = ft.Image(
                            src_base64=base64.b64encode(b).decode("utf-8"),
                            width=360,
                            height=360,
                            fit=ft.ImageFit.CONTAIN
                        )
                        preview_image.content = image
                    except Exception:
                        pass
            filename_text.value = f.name
            try:
                preview_image.update()
                filename_text.update()
            except Exception:
                pass

    def on_click_upload(e):
        file_picker = ft.FilePicker(on_result=on_file_picker_result)
        e.page.overlay.append(file_picker)
        file_picker.pick_files(allow_multiple=False)

    # ============ HEADER ============
    menu_items = [
        ft.PopupMenuItem(text="Inicio", icon=Icons.HOME),
        ft.PopupMenuItem(text="Análisis", icon=Icons.ANALYTICS),
        ft.PopupMenuItem(text="Historial", icon=Icons.HISTORY),
        ft.PopupMenuItem(),  # Divisor
        ft.PopupMenuItem(text="Configuración", icon=Icons.SETTINGS),
    ]

    header = ft.Container(
        height=90,
        bgcolor=PRIMARY_COLOR,
        padding=ft.padding.symmetric(horizontal=24, vertical=12),
        content=ft.Row(
            controls=[
                # Logo
                ft.Container(
                    content=ft.Image(src="logo.png", width=180, height=90, fit=ft.ImageFit.CONTAIN),
                    width=200,
                    alignment=ft.alignment.center_left
                ),
                # Título
                ft.Container(
                    content=ft.Text(
                        "Neurovision V0.01",
                        color="#FFFFFF",
                        size=16,
                        weight=ft.FontWeight.W_700
                    ),
                    alignment=ft.alignment.center,
                    expand=True
                ),
                # Menú con PopupMenuButton (responsivo)
                ft.PopupMenuButton(
                    items=menu_items,
                    icon=Icons.MORE_VERT,
                    icon_color="#FFFFFF",
                    tooltip="Menú"
                ),
            ],
            vertical_alignment=ft.CrossAxisAlignment.CENTER,
            spacing=16
        )
    )

    # ============ ÁREA PRINCIPAL ============
    # Preview Container - Mejorado
    preview_container = ft.Container(
        content=ft.Column(
            controls=[
                ft.Text(
                    "Vista Previa DICOM",
                    size=14,
                    weight=ft.FontWeight.W_600,
                    color=TEXT_PRIMARY
                ),
                ft.Container(height=12),
                preview_image,
                ft.Container(height=12),
                ft.Container(
                    content=ft.Row(
                        controls=[
                            ft.Icon(Icons.FILE_PRESENT, size=16, color=SECONDARY_COLOR),
                            ft.Container(width=6),
                            filename_text
                        ],
                        spacing=0
                    )
                )
            ],
            spacing=0,
            horizontal_alignment=ft.CrossAxisAlignment.START
        ),
        width=420,
        padding=ft.padding.all(24),
        bgcolor=CARD_BG,
        border_radius=ft.border_radius.all(12),
    )

    # Form Container - Mejorado
    form_container = ft.Container(
        content=ft.Column(
            controls=[
                ft.Text(
                    "Datos del Paciente",
                    size=14,
                    weight=ft.FontWeight.W_600,
                    color=TEXT_PRIMARY
                ),
                ft.Container(height=16),
                id_field,
                name_field,
                study_field,
                date_field,
                notes_field,
            ],
            spacing=12,
            horizontal_alignment=ft.CrossAxisAlignment.STRETCH
        ),
        width=420,
        padding=ft.padding.all(24),
        bgcolor=CARD_BG,
        border_radius=ft.border_radius.all(12),
    )

    # Main content row - Responsivo
    content_row = ft.Row(
        controls=[preview_container, form_container],
        alignment=ft.MainAxisAlignment.CENTER,
        vertical_alignment=ft.CrossAxisAlignment.START,
        spacing=32,
        wrap=True  # Para responsividad en pantallas pequeñas
    )

    # ============ BOTONES DE ACCIÓN ============
    # Botón de información
    info_button = ft.IconButton(
        icon=Icons.INFO_OUTLINED,
        icon_color="#FFFFFF",
        bgcolor=SECONDARY_COLOR,
        tooltip="Información",
    )

    # Botón Subir
    upload_btn = ft.ElevatedButton(
        text="Subir Imagen",
        icon=Icons.CLOUD_UPLOAD,
        bgcolor="#3048FF",
        color="#FFFFFF",
        on_click=on_click_upload,
        height=48,
        width=200,
        style=ft.ButtonStyle(
            shape=ft.RoundedRectangleBorder(radius=10),
        ),
    )

    # Botón Analizar
    analyze_btn = ft.ElevatedButton(
        text="Generar Análisis",
        icon=Icons.PLAY_ARROW,
        bgcolor=SUCCESS_COLOR,
        color="#FFFFFF",
        height=48,
        width=200,
        style=ft.ButtonStyle(
            shape=ft.RoundedRectangleBorder(radius=10),
        ),
    )

    # Botón Historial
    history_btn = ft.ElevatedButton(
        text="Historial",
        icon=Icons.FOLDER_OPEN,
        bgcolor=WARNING_COLOR,
        color="#FFFFFF",
        height=48,
        width=200,
        style=ft.ButtonStyle(
            shape=ft.RoundedRectangleBorder(radius=10),
        ),
    )

    # Fila de botones - Responsiva
    buttons_row = ft.Row(
        controls=[
            info_button,
            upload_btn,
            analyze_btn,
            history_btn,
        ],
        alignment=ft.MainAxisAlignment.CENTER,
        spacing=20,
        wrap=True
    )

    # ============ FOOTER ============
    footer = ft.Container(
        content=ft.Row(
            controls=[
                ft.Text(
                    "© 2025 NeuroVision - Sistema de Análisis Médico",
                    size=11,
                    color=TEXT_SECONDARY,
                    italic=True
                )
            ],
            alignment=ft.MainAxisAlignment.CENTER
        ),
        padding=ft.padding.symmetric(vertical=12),
        bgcolor=LIGHT_BG,
    )

    # ============ LAYOUT PRINCIPAL ============
    main_column = ft.Column(
        controls=[
            header,
            ft.Container(
                content=ft.Column(
                    controls=[
                        ft.Container(height=24),
                        content_row,
                        ft.Container(height=32),
                        buttons_row,
                        ft.Container(height=24),
                    ],
                    alignment=ft.MainAxisAlignment.START,
                    horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                    spacing=0
                ),
                bgcolor=LIGHT_BG,
                expand=True,
                padding=ft.padding.symmetric(horizontal=16)
            ),
            footer
        ],
        alignment=ft.MainAxisAlignment.START,
        horizontal_alignment=ft.CrossAxisAlignment.STRETCH,
        spacing=0,
        expand=True
    )

    return main_column
