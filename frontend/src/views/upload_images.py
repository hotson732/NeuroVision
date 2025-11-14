#src/views/upload_images.py

def create_upload_images_view(page):
    """Crea la vista de subida de imágenes (prototipo).

    La función devuelve un control `ft.Column` que puede añadirse directamente
    a la página principal como en `login_views.py`.
    """

    import flet as ft
    from flet import Icons

    # Preview image control (vacío por defecto)
    preview_image = ft.Image(
        #src="",
        width=360,
        height=360,
        fit=ft.ImageFit.CONTAIN
    )

    filename_text = ft.Text("", size=12, color="#6B6B6B")

    # Campos del formulario (derecha)
    id_field = ft.TextField(label="ID Paciente", width=360, border=ft.InputBorder.OUTLINE, border_radius=ft.border_radius.all(6))
    name_field = ft.TextField(label="Nombre Paciente", width=360, border=ft.InputBorder.OUTLINE, border_radius=ft.border_radius.all(6))
    study_field = ft.TextField(label="Tipo de Estudio", width=360, border=ft.InputBorder.OUTLINE, border_radius=ft.border_radius.all(6))
    date_field = ft.TextField(label="Fecha Análisis", width=360, border=ft.InputBorder.OUTLINE, border_radius=ft.border_radius.all(6))
    notes_field = ft.TextField(label="Notas del Médico", width=360, height=140, multiline=True, border=ft.InputBorder.OUTLINE, border_radius=ft.border_radius.all(6))

    # Handler para el resultado del FilePicker
    def on_file_picker_result(e: ft.FilePickerResultEvent):
        # Si se seleccionó un archivo, actualizar vista previa y nombre
        if e.files and len(e.files) > 0:
            f = e.files[0]
            # Intentar usar la ruta local (funciona en modo escritorio); en web puede requerir conversión
            try:
                preview_image.src = f.path
            except Exception:
                # Fallback: si existe base64, usarla
                if hasattr(f, "read_bytes"):
                    try:
                        b = f.read_bytes()
                        import base64

                        preview_image.src_base64 = base64.b64encode(b).decode("utf-8")
                    except Exception:
                        pass
            filename_text.value = f.name
            # Forzar actualización en la página (cuando el control esté en la página)
            try:
                preview_image.update()
                filename_text.update()
            except Exception:
                pass

    # Botón que abre FilePicker
    def on_click_upload(e: ft.ControlEvent):
        # Crear FilePicker dinámicamente y añadirlo al overlay para obtener resultado
        file_picker = ft.FilePicker(on_result=on_file_picker_result)
        # permite la interacción
        e.page.overlay.append(file_picker)
        file_picker.pick_files(allow_multiple=False)

    # Botones inferiores
    info_button = ft.IconButton(icon=Icons.INFO_OUTLINE, icon_color="#6B6B6B", tooltip="Información")

    upload_button = ft.ElevatedButton(
        "Subir Imagen",
        icon=Icons.ADD,
        bgcolor="#3048FF",
        color="white",
        on_click=on_click_upload,
        style=ft.ButtonStyle(shape=ft.RoundedRectangleBorder(radius=8)),
        height=44,
        width=220
    )

    analyze_button = ft.ElevatedButton(
        "Generar Análisis",
        icon=Icons.PLAY_ARROW,
        bgcolor="#77B800",
        color="white",
        height=44,
        width=220,
        style=ft.ButtonStyle(shape=ft.RoundedRectangleBorder(radius=8))
    )

    history_button = ft.ElevatedButton(
        "Historial de Análisis",
        icon=Icons.FOLDER_OPEN,
        bgcolor="#C9A300",
        color="white",
        height=44,
        width=220,
        style=ft.ButtonStyle(shape=ft.RoundedRectangleBorder(radius=8))
    )

    # Contenedor izquierdo (preview)
    preview_container = ft.Container(
        content=ft.Column(
            controls=[
                ft.Container(height=8),
                ft.Container(
                    content=preview_image,
                    width=380,
                    height=380,
                    bgcolor="#EDEDED",
                    border_radius=ft.border_radius.all(12),
                    padding=ft.padding.all(12),
                    alignment=ft.alignment.center
                ),
                ft.Container(height=8),
                filename_text
            ],
            alignment=ft.MainAxisAlignment.START,
            horizontal_alignment=ft.CrossAxisAlignment.CENTER
        ),
        width=420,
        height=520,
        padding=ft.padding.all(6)
    )

    # Contenedor derecho (formulario)
    form_column = ft.Column(
        controls=[
            id_field,
            name_field,
            study_field,
            date_field,
            notes_field
        ],
        alignment=ft.MainAxisAlignment.START,
        horizontal_alignment=ft.CrossAxisAlignment.STRETCH,
        spacing=12
    )

    form_container = ft.Container(
        content=form_column,
        width=420,
        height=520,
        bgcolor="#EDEDED",
        border_radius=ft.border_radius.all(12),
        padding=ft.padding.symmetric(horizontal=18, vertical=18)
    )

    # Fila principal
    main_row = ft.Row(
        controls=[preview_container, form_container],
        alignment=ft.MainAxisAlignment.CENTER,
        vertical_alignment=ft.CrossAxisAlignment.CENTER,
        spacing=48
    )

    # Botones al fondo, centrados
    buttons_row = ft.Row(
        controls=[
            info_button,
            ft.Container(width=12),
            upload_button,
            ft.Container(width=12),
            analyze_button,
            ft.Container(width=12),
            history_button
        ],
        alignment=ft.MainAxisAlignment.CENTER
    )

    footer_text = ft.Text("© 2025 NeuroVision", size=11, color="#6B6B6B")

    main_column = ft.Column(
        controls=[
            # Título superior
            ft.Row(
                controls=[
                    ft.Text("Neurovision V0.01", size=14, weight=ft.FontWeight.W_700, color="#0B2163"),
                ],
                alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                vertical_alignment=ft.CrossAxisAlignment.CENTER
            ),
            ft.Container(height=14),
            main_row,
            ft.Container(height=22),
            buttons_row,
            ft.Container(height=18),
            footer_text
        ],
        alignment=ft.MainAxisAlignment.CENTER,
        horizontal_alignment=ft.CrossAxisAlignment.CENTER,
        spacing=6
    )

    return main_column
