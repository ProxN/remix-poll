const PageLayout: React.FC = ({ children }) => {
  return (
    <section className="section">
      <div className="container">
        <h1 className="heading">
          Remix <span>Poll</span>
        </h1>
        {children}
      </div>
    </section>
  );
};

export default PageLayout;
