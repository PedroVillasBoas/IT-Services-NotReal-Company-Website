export default function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="container">
          <h1>Bem-vindo à Nossa Solução de TI</h1>
          <p>Seu parceiro de confiança para serviços de tecnologia de ponta.</p>
        </div>
      </section>

      <section className="company-history section-padding">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="section-title">Nossa Jornada</h2>
            <p>
              Fundado em 2025, nossa empresa de serviços de TI começou com a
              visão de revolucionar o cenário tecnológico, oferecendo soluções
              incomparáveis adaptadas a empresas de todos os tamanhos. Desde
              nossos humildes começos, crescemos e nos tornamos um dos
              principais provedores de serviços abrangentes de TI, impulsionados
              pela paixão pela inovação e pelo compromisso com o sucesso do
              cliente.
            </p>
          </div>
          <div className="video-container">
            <h2 className="section-title">Nossa Apresentação</h2>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/CUVplysKO_M"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </section>

      <section className="founders section-padding bg-light-gray">
        <div className="container">
          <h2 className="text-center mb-8">Conheça Nossos Fundadores</h2>
          <div className="overflow-x-auto">
            <table className="founders-table w-full">
              <thead>
                <tr>
                  <th>Função</th>
                  <th>Nome</th>
                  <th>CV</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CEO</td>
                  <td>Pedro Vilas Bôas</td>
                  <td>
                    Com mais de 20 anos de experiência em planejamento
                    estratégico de TI, Pedro lidera nossa empresa com uma visão
                    de avanço tecnológico.
                  </td>
                </tr>
                <tr>
                  <td>CTO</td>
                  <td>John Doe</td>
                  <td>
                    Um renomado especialista em arquitetura de software, John é
                    o cérebro técnico por trás de nossas ofertas de serviços
                    inovadores.
                  </td>
                </tr>
                <tr>
                  <td>COO</td>
                  <td>Claire Frost</td>
                  <td>
                    Claire traz uma ampla experiência em gestão operacional,
                    garantindo a entrega eficiente de serviços e a satisfação
                    excepcional do cliente.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="gallery section-padding bg-light-blue">
        <div className="container">
          <h2 className="text-center mb-8">Nossas Instalações & Equipe</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img
              src="/assets/gallery1.jpg"
              alt="Office space"
              className="gallery-thumbnail"
            />
            <img
              src="/assets/gallery2.jpg"
              alt="Team collaborating"
              className="gallery-thumbnail"
            />
            <img
              src="/assets/gallery3.jpg"
              alt="Server room"
              className="gallery-thumbnail"
            />
            <img
              src="/assets/gallery4.jpg"
              alt="Meeting room"
              className="gallery-thumbnail"
            />
          </div>
        </div>
      </section>

      <section className="services section-padding">
        <div className="container">
          <h2 className="text-center mb-8">Nossos Serviços Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="service-card">
              <h3>Soluções em Nuvem</h3>
              <p>
                Aproveite o poder da nuvem com nossas soluções seguras e
                escaláveis para armazenamento de dados, computação e hospedagem
                de aplicativos.
              </p>
            </div>
            <div className="service-card">
              <h3>Cibersegurança</h3>
              <p>
                Proteja seus ativos valiosos contra ameaças em evolução com
                nossas robustas estratégias de cibersegurança, incluindo
                detecção de ameaças e resposta a incidentes.
              </p>
            </div>
            <div className="service-card">
              <h3>TI Gerenciada</h3>
              <p>
                Confie suas operações de TI à nossa equipe de especialistas,
                garantindo desempenho contínuo, manutenção proativa e suporte
                24/7.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
