import { app } from "../app";
import supertest from "supertest";
import { Db, MongoClient, ObjectID } from "mongodb";
import { UserMongo } from "../types";
import { base64Name, jwt } from "../utils";
import { ACCESSSECRET } from "../config";

const request = supertest(app);

describe("UpdateUser tests", () => {
  let client: MongoClient;
  let dbInstance: Db;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbInstance = client.db("fintech");
    app.locals.db = dbInstance;
  });

  afterAll(async () => {
    delete app.locals.db;
    await dbInstance
      .collection<UserMongo>("users")
      .deleteMany({ _id: new ObjectID("000000000000000000000007") });
    await client.close();
  });

  it("test UpdateUser valid access token", async (done) => {
    const users = dbInstance.collection<UserMongo>("users");
    await users.insertOne({
      _id: new ObjectID("000000000000000000000007"),
      name: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      RFC: "",
      CURP: "",
      clabe: "",
      mobile: "",
      accountAvailable: 0,
      accountTotal: 0,
    });
    const response = await request
      .post("/api/graphql")
      .send({
        query: `mutation UpdateUserMutation($input: UpdateUserInput!) {
          updateUser(input: $input) {
            error
            validAccessToken
            user {
              name
              apellidoPaterno
              apellidoMaterno
              RFC
              CURP
              clabe
              mobile
            }
          }
        }`,
        variables: {
          input: {
            user_gid: base64Name("000000000000000000000007", "User"),
            name: "Armando Narcizo",
            apellidoPaterno: "Rueda",
            apellidoMaterno: "Peréz",
            RFC: "RFC",
            CURP: "CURP",
            clabe: "clabe",
            mobile: "9831228788",
          },
        },
        operationName: "UpdateUserMutation",
      })
      .set("Accept", "application/json")
      .set(
        "Authorization",
        JSON.stringify({
          accessToken: jwt.sign(
            { _id: "000000000000000000000007", email: "" },
            ACCESSSECRET,
            { expiresIn: "15m" }
          ),
          refreshToken: "validRefreshToken",
        })
      );
    expect(response.body.data.updateUser.error).toBeFalsy();
    expect(response.body.data.updateUser.validAccessToken).toBeTruthy();
    expect(response.body.data.updateUser.user.name).toBeTruthy();
    expect(response.body.data.updateUser.user.apellidoPaterno).toBeTruthy();
    expect(response.body.data.updateUser.user.apellidoMaterno).toBeTruthy();
    expect(response.body.data.updateUser.user.RFC).toBeTruthy();
    expect(response.body.data.updateUser.user.CURP).toBeTruthy();
    expect(response.body.data.updateUser.user.clabe).toBeTruthy();
    expect(response.body.data.updateUser.user.mobile).toBeTruthy();
    done();
  });
});
