import "../styles/Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footerContent">
        <div className="footerLogo">
          <img
            src="https://placehold.co/40x40/FFFFFF/2563eb?text=E"
            alt="Student Management System Logo"
            width={40}
            height={40}
          />
          <h2>EduManage</h2>
        </div>
        <div className="footerLinks">
          <div className="footerLinkGroup">
            <h3>Product</h3>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footerLinkGroup">
            <h3>Company</h3>
            <a href="#about">About Us</a>
            <a href="#careers">Careers</a>
            <a href="#blog">Blog</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footerLinkGroup">
            <h3>Resources</h3>
            <a href="#docs">Documentation</a>
            <a href="#support">Support</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
      <div className="footerBottom">
        <p>&copy; {new Date().getFullYear()} EduManage. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
