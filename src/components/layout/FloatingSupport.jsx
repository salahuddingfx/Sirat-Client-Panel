export default function FloatingSupport() {
  return (
    <>
      <style>{`
        .wa-float-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          background: #25D366;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(37, 211, 102, 0.3);
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-decoration: none;
        }
        .wa-float-btn:hover {
          transform: scale(1.1) translateY(-4px);
          box-shadow: 0 12px 36px rgba(37, 211, 102, 0.55);
        }
        @media (max-width: 480px) {
          .wa-float-btn {
            width: 42px !important;
            height: 42px !important;
            bottom: 16px !important;
            right: 16px !important;
          }
          .wa-float-btn svg {
            width: 20px !important;
            height: 20px !important;
          }
        }
      `}</style>
      <a
        href="https://wa.me/8801700000000"
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float-btn"
        aria-label="Chat with Support"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.424 5.429 0 12.04 0c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.617-5.43 12.04-12.04 12.04-2.007-.001-3.98-.502-5.733-1.464L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.793 1.453 5.378 0 9.761-4.38 9.765-9.76.002-2.607-1.01-5.057-2.859-6.908C16.449 2.088 14 1.077 11.96 1.077 6.582 1.077 2.2 5.457 2.197 10.835c-.001 1.704.469 3.366 1.362 4.821L2.553 20.3l4.794-1.257zM17.447 14.9c-.29-.145-1.72-.85-1.985-.95-.267-.097-.463-.146-.658.146-.195.29-.755.95-.925 1.144-.171.196-.341.22-.63.074-.29-.145-1.228-.453-2.339-1.444-.864-.772-1.448-1.724-1.618-2.014-.17-.29-.018-.447.127-.59.13-.13.29-.34.435-.508.145-.17.193-.29.292-.483.097-.194.048-.363-.025-.508-.073-.146-.66-1.59-.903-2.175-.236-.57-.478-.49-.658-.5H7.75c-.195 0-.51.072-.776.363-.266.29-1.02 1-1.02 2.438 0 1.437 1.045 2.825 1.19 3.018.145.194 2.055 3.14 4.978 4.4 2.923 1.259 2.923.84 3.453.79.53-.05 1.72-.7 1.96-1.378.24-.678.24-1.258.17-1.377-.07-.119-.265-.194-.556-.34z" />
        </svg>
      </a>
    </>
  );
}
