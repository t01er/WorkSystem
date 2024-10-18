<?php
include '../db/database.php';

$database = new Database();
$conexion = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id_trabajador = $_POST['id_trabajador'];
    $nombres = $_POST['nombres'];
    $apellido_p = $_POST['apellido_p'];
    $apellido_m = $_POST['apellido_m'];
    $dni = $_POST['dni'];
    $numero_cel = $_POST['numero_cel'];
    $sexo = $_POST['sexo'];
    $id_puesto = $_POST['id_puesto'];
    $id_horario = $_POST['id_horario'];
    $estado = $_POST['estado'];
    $salario_por_dia = $_POST['salario_por_dia'];

    $files = null; // Inicia como null, solo se actualizará si hay un archivo

    // Manejo de archivos
    if (isset($_FILES['files']) && count($_FILES['files']['name']) > 0 && $_FILES['files']['name'][0] !== '') {
        $file_name = $_FILES['files']['name'][0]; 
        $file_tmp = $_FILES['files']['tmp_name'][0];

        // Generar un nuevo nombre único para el archivo
        $new_file_name = uniqid() . '.' . pathinfo($file_name, PATHINFO_EXTENSION);
        $upload_dir = '../uploads/' . $new_file_name;

        // Mover el archivo a la carpeta uploads
        if (move_uploaded_file($file_tmp, $upload_dir)) {
            $files = $new_file_name;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al subir el archivo']);
            exit;
        }
    }

    // Armar la consulta SQL
    if ($files) {
        // Si hay un archivo, actualiza todos los campos, incluida la imagen
        $sql = "UPDATE trabajador 
                SET nombres = ?, apellido_p = ?, apellido_m = ?, dni = ?, numero_cel = ?, sexo = ?, files = ?, id_puesto = ?, id_horario = ?, estado = ?, salario_por_dia = ?
                WHERE id_trabajador = ?";
        
        // Preparar la consulta
        if ($stmt = $conexion->prepare($sql)) {
            // Asociar los parámetros
            $stmt->bind_param(
                "ssssisssidsi",
                $nombres,
                $apellido_p,
                $apellido_m,
                $dni,
                $numero_cel,
                $sexo,
                $files,
                $id_puesto,
                $id_horario,
                $estado,
                $salario_por_dia,
                $id_trabajador
            );
        }
    } else {
        // Si no hay archivo, actualiza todos los campos excepto la imagen
        $sql = "UPDATE trabajador 
                SET nombres = ?, apellido_p = ?, apellido_m = ?, dni = ?, numero_cel = ?, sexo = ?, id_puesto = ?, id_horario = ?, estado = ?, salario_por_dia = ?
                WHERE id_trabajador = ?";

        // Preparar la consulta
        if ($stmt = $conexion->prepare($sql)) {
            // Asociar los parámetros
            $stmt->bind_param(
                "ssssissidsi",
                $nombres,
                $apellido_p,
                $apellido_m,
                $dni,
                $numero_cel,
                $sexo,
                $id_puesto,
                $id_horario,
                $estado,
                $salario_por_dia,
                $id_trabajador
            );
        }
    }

    // Ejecutar la consulta
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Trabajador actualizado con éxito']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al actualizar trabajador']);
    }

    // Cerrar el statement y la conexión
    $stmt->close();
    $conexion->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
}
?>
