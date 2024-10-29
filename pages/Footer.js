// components/Footer.js
import Link from 'next/link'; // Importa Link si usas Next.js
import { FaLinkedin, FaGithub } from 'react-icons/fa'; // Importa íconos
import Image from 'next/image'; // Importa Image si usas Next.js

const Footer = () => {
  return (
    <footer style={{ textAlign: "center", padding: "1rem", background: "#616a6b", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
      <div>
        <Link href="mailto:martinarcosvargas2@gmail.com" style={{ margin: "0 10px" }}>
        martinarcosvargas2@gmail.com
        </Link>
        </div>
      <div>
      <Image src="/logo.png" alt="Logo" width={50} height={50} /> {/* Asegúrate de que el logo esté en public/images */}
      <p>Martín Arcos Vargas</p>
      </div>
      <div>
 
      <a 
        href="https://www.linkedin.com/in/martin-arcos" 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ margin: "0 10px" }}
        >
        <FaLinkedin size={34} />
        
        </a>

        <a href="https://github.com/cozakoo" target="_blank" rel="noopener noreferrer" style={{ margin: "0 10px" }}>
          <FaGithub size={34} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
    