from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'Medical Backend API',
        'timestamp': datetime.now().isoformat()
    })

# Pacientes endpoints
@app.route('/api/pacientes', methods=['GET'])
def get_pacientes():
    try:
        query = """
        SELECT id_paciente, nombre, apellido, fecha_nacimiento, genero, 
               numero_historia_clinica, fecha_creacion
        FROM pacientes 
        ORDER BY fecha_creacion DESC
        """
        pacientes = db.execute_query(query)
        
        result = []
        for paciente in pacientes:
            result.append({
                'id_paciente': paciente[0],
                'nombre': paciente[1],
                'apellido': paciente[2],
                'fecha_nacimiento': paciente[3].isoformat() if paciente[3] else None,
                'genero': paciente[4],
                'numero_historia_clinica': paciente[5],
                'fecha_creacion': paciente[6].isoformat() if paciente[6] else None
            })
        
        return jsonify({'pacientes': result, 'status': 'success'})
    
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 500

@app.route('/api/pacientes', methods=['POST'])
def create_paciente():
    try:
        data = request.json
        paciente_id = str(uuid.uuid4())
        
        query = """
        INSERT INTO pacientes 
        (id_paciente, nombre, apellido, fecha_nacimiento, genero, 
         numero_historia_clinica, antecedentes_medicos, fecha_creacion, creado_por)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        params = (
            paciente_id,
            data.get('nombre'),
            data.get('apellido'),
            data.get('fecha_nacimiento'),
            data.get('genero'),
            data.get('numero_historia_clinica'),
            data.get('antecedentes_medicos'),
            datetime.now(),
            data.get('creado_por', 'system')  # En producción usar JWT
        )
        
        db.execute_query(query, params)
        
        return jsonify({
            'message': 'Paciente creado exitosamente',
            'id_paciente': paciente_id,
            'status': 'success'
        })
    
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 500

# Estudios médicos endpoints
@app.route('/api/estudios', methods=['GET'])
def get_estudios():
    try:
        query = """
        SELECT e.id_estudio, e.id_paciente, p.nombre, p.apellido, 
               e.tipo_estudio, e.fecha_estudio, e.estado, e.fecha_creacion
        FROM estudios_medicos e
        LEFT JOIN pacientes p ON e.id_paciente = p.id_paciente
        ORDER BY e.fecha_creacion DESC
        """
        estudios = db.execute_query(query)
        
        result = []
        for estudio in estudios:
            result.append({
                'id_estudio': estudio[0],
                'id_paciente': estudio[1],
                'nombre_paciente': f"{estudio[2]} {estudio[3]}",
                'tipo_estudio': estudio[4],
                'fecha_estudio': estudio[5].isoformat() if estudio[5] else None,
                'estado': estudio[6],
                'fecha_creacion': estudio[7].isoformat() if estudio[7] else None
            })
        
        return jsonify({'estudios': result, 'status': 'success'})
    
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 500

@app.route('/api/estudios', methods=['POST'])
def create_estudio():
    try:
        data = request.json
        estudio_id = str(uuid.uuid4())
        
        query = """
        INSERT INTO estudios_medicos 
        (id_estudio, id_paciente, tipo_estudio, fecha_estudio, 
         medico_referente, descripcion_estudio, estado, fecha_creacion, creado_por)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        params = (
            estudio_id,
            data.get('id_paciente'),
            data.get('tipo_estudio'),
            data.get('fecha_estudio'),
            data.get('medico_referente'),
            data.get('descripcion_estudio'),
            data.get('estado', 'Pendiente'),
            datetime.now(),
            data.get('creado_por', 'system')
        )
        
        db.execute_query(query, params)
        
        return jsonify({
            'message': 'Estudio médico creado exitosamente',
            'id_estudio': estudio_id,
            'status': 'success'
        })
    
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 500

# Diagnósticos endpoints
@app.route('/api/diagnosticos', methods=['POST'])
def create_diagnostico():
    try:
        data = request.json
        diagnostico_id = str(uuid.uuid4())
        
        query = """
        INSERT INTO diagnosticos 
        (id_diagnostico, id_estudio, descripcion_diagnostico, 
         hallazgos_principales, observaciones_medicas, fecha_diagnostico, diagnosticado_por)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        
        params = (
            diagnostico_id,
            data.get('id_estudio'),
            data.get('descripcion_diagnostico'),
            data.get('hallazgos_principales'),
            data.get('observaciones_medicas'),
            datetime.now(),
            data.get('diagnosticado_por', 'system')
        )
        
        db.execute_query(query, params)
        
        return jsonify({
            'message': 'Diagnóstico creado exitosamente',
            'id_diagnostico': diagnostico_id,
            'status': 'success'
        })
    
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 500

@app.route('/api/diagnosticos/estudio/<id_estudio>', methods=['GET'])
def get_diagnostico_by_estudio(id_estudio):
    try:
        query = """
        SELECT d.id_diagnostico, d.descripcion_diagnostico, d.hallazgos_principales,
               d.observaciones_medicas, d.fecha_diagnostico, u.nombre, u.apellido
        FROM diagnosticos d
        LEFT JOIN usuarios u ON d.diagnosticado_por = u.id_usuario
        WHERE d.id_estudio = %s
        ORDER BY d.fecha_diagnostico DESC
        LIMIT 1
        """
        
        diagnostico = db.execute_query(query, (id_estudio,))
        
        if diagnostico:
            diag = diagnostico[0]
            return jsonify({
                'diagnostico': {
                    'id_diagnostico': diag[0],
                    'descripcion_diagnostico': diag[1],
                    'hallazgos_principales': diag[2],
                    'observaciones_medicas': diag[3],
                    'fecha_diagnostico': diag[4].isoformat() if diag[4] else None,
                    'medico': f"{diag[5]} {diag[6]}" if diag[5] and diag[6] else 'Sistema'
                },
                'status': 'success'
            })
        else:
            return jsonify({'diagnostico': None, 'status': 'success'})
    
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)