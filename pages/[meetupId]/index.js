import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

const MeetupDetails = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://prince:eVE0yoWA59KS9FKn@cluster0.lijdhrb.mongodb.net/meetups?retryWrites=true&w=majority"
  ); /*Here i've accessed the databse */

  const db =
    client.db(); /*I connect to database here as Ive received the client object and with the help client.db */
  const meetupsCollection = db.collection("meetups"); /*I go to coolection */

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  // Above, I want to fetch all the documents from the collections abecause I need id from the documents so that I can prepare
  // prebuild pages for them. I use find() method from mongodb where first empty parenthesis represent all the documents from
  // the collection and second argument spevify which property I want to fetch like _id from the backend 1 represent only this _id:1

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),

    // Here we mapping into our returned array from the database with id and we pass object with params property and in the params property we return another object

    // [
    //   {
    //     params: {
    //       meetupId: "m1",
    //     },
    //   },
    //   {
    //     params: {
    //       meetupId: "m2",
    //     },
    //   },
    // ],
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    "mongodb+srv://prince:eVE0yoWA59KS9FKn@cluster0.lijdhrb.mongodb.net/meetups?retryWrites=true&w=majority"
  ); /*Here i've created the database named meetups */

  const db =
    client.db(); /*I connect to database here as Ive received the client object and with the help client.db */
  const meetupsCollection = db.collection("meetups"); /*i make the collection */

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });
  client.close();
  return {
    props: {
      meetupData: {
        image: selectedMeetup.image,
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
