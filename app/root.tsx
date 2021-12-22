import { LiveReload, Outlet, Links, Link } from 'remix';
import type { LinksFunction } from 'remix';
import globalStyleUrl from './styles/global.css';
import { Input, links as inputLinks } from './components/Input';
import { Button, links as buttonLinks } from './components/Button';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStyleUrl },
    ...inputLinks(),
    ...buttonLinks(),
  ];
};

const App = () => {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
};

const Document: React.FC<{ title?: string }> = ({ children, title }) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title && <title>{title}</title>}
        <Links />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
};

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="header__search">
            <Input placeholder="Search for polls" />
          </div>
          <Link to=".">
            <Button variant="primary">Create a poll</Button>
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
};

export default App;
