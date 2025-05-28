import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Project Name 1',
    description: 'A brief description of the project and its main features.',
    image: 'https://via.placeholder.com/400x250',
    technologies: ['React', 'Node.js', 'MongoDB'],
    github: '#',
    demo: '#',
  },
  {
    title: 'Project Name 2',
    description: 'A brief description of the project and its main features.',
    image: 'https://via.placeholder.com/400x250',
    technologies: ['Vue.js', 'Firebase', 'Tailwind'],
    github: '#',
    demo: '#',
  },
  {
    title: 'Project Name 3',
    description: 'A brief description of the project and its main features.',
    image: 'https://via.placeholder.com/400x250',
    technologies: ['Python', 'Django', 'PostgreSQL'],
    github: '#',
    demo: '#',
  },
];

const ProjectCard = ({ project, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
  >
    <img src={project.image} alt={project.title} className="w-full" />
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex space-x-4">
        <a
          href={project.github}
          className="text-blue-600 hover:text-blue-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href={project.demo}
          className="text-blue-600 hover:text-blue-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          Live Demo
        </a>
      </div>
    </div>
  </motion.div>
);

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-12 text-center"
        >
          Featured Projects
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
} 