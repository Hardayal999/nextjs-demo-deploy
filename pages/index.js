import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>Reach Meetups</title>
        {/* You will see this title on top of the page */}
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </>
  );
};

// export async function getServerSideProps(context){
//   const req=context.req;
//   const res= context.res;

//   /*We have an access to context parameters in the server side props function(we do have access of context in static props as weel) but
//   in server side function youcan use context.req to get access of the url which can be useful for you to check the authentication
//   which we are not allowed to do in static props function as this function gets executed during build production not for every request sent to the server*/
//   return{
//     props:{
//       meetups:DUMMY_MEETUPS
//     }
//   }

//   // You cant use revalidate here because with thw server side function this gets executed on every request sent to server to fetch the data
// }

export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://prince:eVE0yoWA59KS9FKn@cluster0.lijdhrb.mongodb.net/meetups?retryWrites=true&w=majority"
  ); /*Heres im connected to the database meetups */

  const db =
    client.db(); /*I connect to database here as Ive received the client object and with the help client.db */
  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection
    .find()
    .toArray(); /*find() method help you to find all the documents in the meetup database and to array() method convert into array  */

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },

    revalidate: 1 /*1 sec means */,

    // Here you fetch the data and this is async function so it waits for the data and then we pass this data to the page components attached to it via props.
    // It is an async function
  };
}
export default HomePage;
