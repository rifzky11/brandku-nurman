import CardGrid from "../components/CardGrid";
import Hero from "../components/Hero";

function Home({features}) {
  return (
    <>
      <h1 className="text-green-500">Home</h1>
      <section>
        <Hero />
      </section>
      <section>
        <CardGrid data={features}/>
      </section>
    </>
  );
}

export default Home;
