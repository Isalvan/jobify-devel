<?php

namespace Database\Factories;

use App\Models\Empresa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Trabajo>
 */
class TrabajoFactory extends Factory
{
    public function definition(): array
    {
        $techJobs = [
            [
                'title' => 'Senior React Developer',
                'salary_min' => 45000,
                'salary_max' => 65000,
                'description' => "Buscamos un experto en React para liderar nuestro equipo de frontend. Deberás tener experiencia en arquitectura de componentes y estado global.\n\nResponsabilidades:\n- Desarrollo y mantenimiento de características.\n- Colaboración con equipos cross-funcionales.\n- Revisión de código y mentoría.\n\nRequisitos:\n- Experiencia demostrable en el rol.\n- Capacidad de resolución de problemas.\n- Buenas habilidades de comunicación.",
            ],
            [
                'title' => 'Full Stack Laravel Developer',
                'salary_min' => 35000,
                'salary_max' => 55000,
                'description' => "Necesitamos un desarrollador versátil con experiencia en PHP/Laravel y JavaScript moderno. Trabajarás en productos escalables.\n\nResponsabilidades:\n- Diseño de APIs RESTful.\n- Integración de servicios de terceros.\n- Mantenimiento de bases de datos.\n\nRequisitos:\n- Dominio de PHP 8+ y Laravel.\n- Conocimientos de SQL y optimización.\n- Familiaridad con Vue o React.",
            ],
            [
                'title' => 'DevOps Engineer',
                'salary_min' => 50000,
                'salary_max' => 75000,
                'description' => "Únete a nuestro equipo para automatizar despliegues y gestionar infraestructura en AWS.\n\nResponsabilidades:\n- Gestión de pipelines CI/CD.\n- Monitorización de servicios.\n- Automatización de infraestructura como código.\n\nRequisitos:\n- Experiencia con Docker y Kubernetes.\n- Conocimientos de Terraform o Ansible.\n- Certificación AWS valorable.",
            ],
            [
                'title' => 'Junior Frontend Developer',
                'salary_min' => 22000,
                'salary_max' => 28000,
                'description' => "Oportunidad para desarrolladores junior con pasión por interfaces limpias.\n\nResponsabilidades:\n- Implementación de diseños UI.\n- Corrección de bugs.\n- Aprendizaje continuo.\n\nRequisitos:\n- Conocimientos sólidos de HTML/CSS/JS.\n- Ganas de aprender React o Vue.\n- Portafolio de proyectos personales.",
            ],
            [
                'title' => 'Product Manager',
                'salary_min' => 45000,
                'salary_max' => 70000,
                'description' => "Lidera la visión de nuestro producto principal.\n\nResponsabilidades:\n- Gestión del backlog y roadmap.\n- Definición de requisitos con stakeholders.\n- Análisis de métricas de uso.\n\nRequisitos:\n- Experiencia en gestión de productos digitales.\n- Habilidades de comunicación y liderazgo.\n- Conocimiento de metodologías ágiles.",
            ],
            [
                'title' => 'QA Automation Engineer',
                'salary_min' => 30000,
                'salary_max' => 45000,
                'description' => "Asegura la calidad de nuestro software mediante pruebas automatizadas.\n\nResponsabilidades:\n- Creación de planes de prueba.\n- Automatización de tests E2E.\n- Reporte de bugs.\n\nRequisitos:\n- Experiencia con Cypress, Selenium o Playwright.\n- Conocimientos de programación básica.\n- Detallista y organizado.",
            ],
            [
                'title' => 'Data Scientist',
                'salary_min' => 50000,
                'salary_max' => 80000,
                'description' => "Analiza grandes volúmenes de datos para extraer insights valiosos.\n\nResponsabilidades:\n- Limpieza y procesamiento de datos.\n- Creación de modelos predictivos.\n- Visualización de datos.\n\nRequisitos:\n- Dominio de Python, Pandas y Scikit-learn.\n- Conocimientos sólidos de estadística.\n- Experiencia con SQL.",
            ],
            [
                'title' => 'UX/UI Designer',
                'salary_min' => 30000,
                'salary_max' => 50000,
                'description' => "Diseña experiencias de usuario intuitivas y atractivas.\n\nResponsabilidades:\n- Creación de wireframes y prototipos.\n- Diseño de interfaces de alta fidelidad.\n- Realización de tests de usuario.\n\nRequisitos:\n- Dominio de Figma.\n- Portafolio demostrable.\n- Comprensión de principios de diseño.",
            ],
        ];

        $job = fake()->randomElement($techJobs);

        return [
            'empresa_id' => Empresa::factory(),
            'titulo' => $job['title'],
            'slug' => fake()->slug(),
            'descripcion' => $job['description'], // Already plain text
            'salario' => fake()->numberBetween($job['salary_min'], $job['salary_max']),
            'ubicacion' => fake()->randomElement(['Madrid', 'Barcelona', 'Valencia', 'Remoto', 'Sevilla', 'Málaga']),
            'tipo_trabajo' => fake()->randomElement(['Tiempo Completo', 'Medio Tiempo', 'Freelance']),
            'modalidad' => fake()->randomElement(['PRESENCIAL', 'REMOTO', 'HIBRIDO']),
            'estado' => 'publicado',
            'created_at' => fake()->dateTimeBetween('-3 months', 'now'),
            'updated_at' => fake()->dateTimeBetween('-1 months', 'now'),
        ];
    }
}
