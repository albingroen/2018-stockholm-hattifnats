import React from "react";
import moment from "moment";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  AsyncStorage
} from "react-native";
import { codes } from "../utils/enums";
import Button from "../components/Button";
import axios from "axios";

class JobsScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor() {
    super();
    this.state = {
      jobs: [],
      personalData: {
        name: "",
        city: "",
        age: 0,
        employmentType: "",
        profession: ""
      }
    };
  }

  componentDidMount() {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem("data");
        if (value !== null) {
          this.setState({
            personalData: JSON.parse(value)
          });

          const parsedData = JSON.parse(value);
          const { profession, employmentType, city } = parsedData;

          const parsedCity = codes[city];

          let numberType;
          if (employmentType === "Heltid") {
            numberType = 1;
          } else {
            numberType = 2;
          }

          axios
            .get(
              `http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=${parsedCity}&nyckelord=${profession.toLocaleLowerCase()}&anstallningstyp=${numberType}`,
              {
                headers: {
                  "Accept-Language": "application/json"
                }
              }
            )
            .then(res => {
              this.setState({
                jobs: res.data.matchningslista.matchningdata
              });
            })
            .catch(err => console.log(err.message));
        }
      } catch (error) {
        // Error retrieving data
        console.log("Could not fetch data");
      }
    };

    fetchData();
  }

  render() {
    const { jobs, personalData } = this.state;

    return (
      <ScrollView
        style={{
          backgroundColor: "#f4f4f4",
          flex: 1,
          flexDirection: "column"
        }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "stretch"
        }}
      >
        {jobs && jobs.length > 0 && (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 75,
              paddingBottom: 20
            }}
          >
            <Text
              style={{
                fontSize: 18,
                width: 300,
                textAlign: "center",
                lineHeight: 25
              }}
            >
              Scrolla ner för jobbförslag som jag tror skulle passa dig
            </Text>
          </View>
        )}
        {jobs && jobs.length > 0 ? (
          jobs.map(job => {
            return <JobCard key={job.annonsid} job={job} />;
          })
        ) : (
          <View
            style={{
              paddingTop: 100,
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: 25,
                textAlign: "center"
              }}
            >
              Hittade inga jobb
            </Text>
            <Button
              onClick={() => this.props.navigation.navigate("Conversation")}
            >
              Gör en ny sökning
            </Button>
          </View>
        )}
      </ScrollView>
    );
  }
}

export default JobsScreen;

export class JobCard extends React.Component {
  constructor() {
    super();
    this.state = {
      size: 0
    };
  }

  loadInfo() {
    axios
      .get(
        `http://api.arbetsformedlingen.se/af/v0/platsannonser/${
          this.props.job.annonsid
        }`,
        {
          headers: {
            "Accept-Language": "application/json"
          }
        }
      )
      .then(res => {
        this.setState({
          jobInfo: res.data.platsannons.annons,
          size: 1
        });
      });
  }

  renderTags(text) {
    const exampleTags = [
      "Javascript",
      "Programmering",
      "Kod",
      "Webbutveckling",
      "Junior"
    ];

    if (this.state.size === 1) {
      const matches = exampleTags
        .filter(tag => text.includes(tag.toLocaleLowerCase()))
        .map(tag => tag);

      if (matches === undefined) {
        return [];
      } else {
        return matches;
      }
    }
  }

  render() {
    const { job } = this.props;
    const { jobInfo, size } = this.state;

    return size === 0 ? (
      <TouchableOpacity
        onPress={this.loadInfo.bind(this)}
        style={{
          margin: 10,
          backgroundColor: "white",
          borderRadius: 5
        }}
      >
        <Text
          style={{
            fontSize: 22,
            textAlign: "center",
            backgroundColor: "#3D7BA5",
            color: "white",
            padding: 15,
            fontWeight: "700"
          }}
        >
          {job.annonsrubrik}
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            padding: 15
          }}
        >
          <View
            style={{
              backgroundColor: "#222",
              borderRadius: 100,
              padding: 25,
              margin: 2,
              height: 130,
              width: 130,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                fontWeight: "600",
                color: "white"
              }}
            >
              {job.arbetsplatsnamn}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#BF7483",
              borderRadius: 100,
              padding: 25,

              height: 130,
              width: 130,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                fontWeight: "600",
                color: "white"
              }}
            >
              {job.anstallningstyp}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#639673",
              borderRadius: 100,
              padding: 25,

              height: 125,
              width: 125,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                fontWeight: "600",
                color: "white"
              }}
            >
              {job.kommunnamn}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#DFA122",
              borderRadius: 100,
              padding: 25,

              height: 100,
              width: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                fontWeight: "600",
                color: "white",
                textTransform: "capitalize"
              }}
            >
              {moment(job.sista_ansokningsdag).fromNow()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() => this.setState({ size: 0 })}
        style={{
          backgroundColor: "white",
          borderRadius: 3,
          margin: 10
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "700",
            backgroundColor: "#3D7BA5",
            color: "white",
            padding: 15
          }}
        >
          {job.annonsrubrik}
        </Text>

        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontSize: 20,
              opacity: 0.7,
              fontWeight: "600"
            }}
          >
            {job.arbetsplatsnamn}
          </Text>
          <View
            style={{ display: "flex", flexDirection: "row", paddingTop: 20 }}
          >
            {this.renderTags(jobInfo.annonstext).map(m => {
              return (
                <View
                  key={m}
                  style={{
                    backgroundColor: "#222",
                    padding: 7,
                    borderRadius: 5,
                    display: "inline-flex",
                    marginRight: 5,
                    marginBottom: 5
                  }}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>{m}</Text>
                </View>
              );
            })}
          </View>

          <Text style={{ fontSize: 14, paddingTop: 20 }}>
            {jobInfo.annonstext}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
