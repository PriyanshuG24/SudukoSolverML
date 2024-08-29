function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 w-full mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <h4 className="text-2xl font-bold mb-2">Let's keep in touch!</h4>
            <p className="text-md mb-4 font-semibold">Find us on any of these platforms. We respond within 1-2 business days.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-500 hover:text-blue-600">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-blue-700 hover:text-blue-800">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-pink-500 hover:text-pink-600">
                <i className="fab fa-dribbble"></i>
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-900">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="flex flex-col md:flex-row md:space-x-8 mb-6">
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <span className="block text-sm font-bold mb-2">Useful Links</span>
                <ul className="text-md space-y-1 font-semibold">
                  <li><a href="https://www.creative-tim.com/presentation?ref=njs-profile" className="hover:text-blue-600">About Us</a></li>
                  <li><a href="https://blog.creative-tim.com?ref=njs-profile" className="hover:text-blue-600">Blog</a></li>
                  <li><a href="https://www.github.com/creativetimofficial?ref=njs-profile" className="hover:text-blue-600">Github</a></li>
                  <li><a href="https://www.creative-tim.com/bootstrap-themes/free?ref=njs-profile" className="hover:text-blue-600">Free Products</a></li>
                </ul>
              </div>
              <div className="w-full md:w-1/2">
                <span className="block text-sm font-bold mb-2">Other Resources</span>
                <ul className="text-md space-y-1 font-semibold">
                  <li><a href="https://github.com/creativetimofficial/notus-js/blob/main/LICENSE.md?ref=njs-profile" className="hover:text-blue-600">MIT License</a></li>
                  <li><a href="https://creative-tim.com/terms?ref=njs-profile" className="hover:text-blue-600">Terms & Conditions</a></li>
                  <li><a href="https://creative-tim.com/privacy?ref=njs-profile" className="hover:text-blue-600">Privacy Policy</a></li>
                  <li><a href="https://creative-tim.com/contact-us?ref=njs-profile" className="hover:text-blue-600">Contact Us</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-300" />
        <div className="text-center text-sm text-gray-600">
          <p>&copy; <span id="get-current-year">{new Date().getFullYear()}</span> Sudoku Solver. Built with <a href="https://reactjs.org/" className="hover:text-blue-600">React</a> and <a href="https://tailwindcss.com/" className="hover:text-blue-600">Tailwind CSS</a>.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
