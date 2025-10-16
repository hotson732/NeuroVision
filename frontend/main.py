import flet as ft
import requests
import json
from datetime import datetime
import os

class MedicalApp:
    def __init__(self):
        self.backend_url = "http://backend:5000"
    
    def get_pacientes(self):
        try:
            response = requests.get(f"{self.backend_url}/api/pacientes")
            return response.json()
        except Exception as e:
            return {"error": str(e), "status": "error"}
    
    def create_paciente(self, paciente_data):
        try:
            response = requests.post(
                f"{self.backend_url}/api/pacientes",
                json=paciente_data
            )
            return response.json()
        except Exception as e:
            return {"error": str(e), "status": "error"}

def main(page: ft.Page):
    page.title = "Sistema Médico - Gestión de Pacientes"
    page.theme_mode = ft.ThemeMode.LIGHT
    page.padding = 20
    page.scroll = ft.ScrollMode.ADAPTIVE
    
    medical_app = MedicalApp()
    
    # Controles simples para probar
    status_text = ft.Text("Sistema médico cargado", size=20, color=ft.colors.GREEN)
    pacientes_btn = ft.ElevatedButton("Cargar Pacientes", icon=ft.icons.PEOPLE)
    pacientes_list = ft.Column()
    
    def load_pacientes(e):
        result = medical_app.get_pacientes()
        pacientes_list.controls.clear()
        
        if result.get('status') == 'success':
            for paciente in result.get('pacientes', []):
                pacientes_list.controls.append(
                    ft.Card(
                        content=ft.Container(
                            content=ft.Column([
                                ft.Text(f"{paciente['nombre']} {paciente['apellido']}", 
                                       weight=ft.FontWeight.BOLD),
                                ft.Text(f"Historia: {paciente['numero_historia_clinica']}"),
                            ]),
                            padding=10,
                        )
                    )
                )
            status_text.value = f"Pacientes cargados: {len(result['pacientes'])}"
        else:
            status_text.value = f"Error: {result.get('error', 'Error desconocido')}"
            status_text.color = ft.colors.RED
        
        page.update()
    
    pacientes_btn.on_click = load_pacientes
    
    page.add(
        ft.Column([
            ft.Row([
                ft.Icon(ft.icons.MEDICAL_SERVICES, size=40, color=ft.colors.BLUE),
                ft.Text("Sistema Médico NeuroVision", size=24, weight=ft.FontWeight.BOLD),
            ]),
            ft.Divider(),
            status_text,
            pacientes_btn,
            ft.Text("Lista de Pacientes:", size=16, weight=ft.FontWeight.BOLD),
            pacientes_list,
        ])
    )

# Configuración para Docker
if __name__ == "__main__":
    ft.app(
        target=main,
        view=ft.AppView.WEB_BROWSER,
        port=8000,
        host="0.0.0.0"
    )