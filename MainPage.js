import React, { Component } from 'react';
import {
  AsyncStorage,
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Image,
  NativeModules,
} from 'react-native';
import twitter, {auth} from 'react-native-twitter';
import Geocoder from 'react-native-geocoder';
import Mailer from 'react-native-mail';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import call from 'react-native-phone-call';
import SendSMS from 'react-native-sms-x';
import MailCompose from 'react-native-mail-compose';
// import mailgun from 'mailgun.js';
var SendIntentAndroid = require('react-native-send-intent');
var SmsAndroid = require('react-native-sms-android');

const FBSDK = require('react-native-fbsdk');
const {
  ShareDialog,
  LoginButton,
  AccessToken,
  ShareApi,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
export default class MainPage extends Component {
    constructor(props) {
        super(props);
        // const shareLinkContent = {
        //   contentType: 'link',
        //   contentUrl:' this.state.isiPesan',
        //   contentDescription: 'asdasdasdasdasd',
        // };

        this.state = {
            isiPesan : '',
            alamatEmail : '',
            latitude: '',
            longitude: '',
            address: '',
            phoneNumber: '',
            isiPesanFacebook:'',
            authToken:'',
            authTokenSecret:'',
            tujuanEmail: ''
        }
    }

    postToFacebook = () => {
      AccessToken.getCurrentAccessToken().then(
          (data) => {
              let tempAccesstoken = data.accessToken;
              const _responseInfoCallback = (error, result) => {
                  console.log(result);
              }

              const postRequestParams = {
                  message: {
                      string: this.state.isiPesan+' https://www.google.com/maps/search/?api=1&query='+this.state.latitude+','+this.state.longitude
                  }
              }

              const postRequestConfig = {
                  httpMethod: "POST",
                  version: "v2.9",
                  parameters: postRequestParams,
                  accessToken: tempAccesstoken
              }

              console.log(postRequestConfig);

              const infoRequest = new GraphRequest(
                  "/me/feed",
                  postRequestConfig,
                  _responseInfoCallback,
              );
              console.log("infoRequest");
              console.log(infoRequest);

              new GraphRequestManager().addRequest(infoRequest).start();
          });
  }
    // shareLinkWithShareDialog() {
    //   var tmp = this;
    //   ShareApi.canShare(this.state.shareLinkContent).then(
    //     function(canShare) {
    //       if (canShare) {
    //         return ShareApi.share(tmp.state.shareLinkContent, '/me', 'Some message.');
    //       }
    //     }
    //   ).then(
    //     function(result) {
    //       alert('Pesan Ke Facebook Telah Berhasil');
    //     },
    //     function(error) {
    //       alert('Share with ShareApi failed with error: ' + error);
    //     }
    //   );
    // }   

    sendHelp(){
        const tokens = {
            consumerKey : 'lQIgRGASAc27nYqCKdSCH3zm8',
            consumerSecret : 'bzquAPIucZDoIJMc4l1RjtiEhZgKiHN7Qfd7tvcqKHHjRLNGDa',
            accessToken : '76000685-KsTQcl0roDvtc4xkRd2htS6oOhAEOvpqeTdg6WVg2',
            accessTokenSecret : 'ootvcFDwTJ6AbqUIXJ6F9ocwsIhnCxHaMUCVEE2SH3liQ',
        }

        

        // call(args).catch(console.error)
        const {rest} = twitter(tokens);
        var path = 'statuses/update';
        var text = {status:this.state.isiPesan+' https://www.google.com/maps/search/?api=1&query='+this.state.latitude+','+this.state.longitude,
                    lat:this.state.latitude,
                    long: this.state.longitude
                    };
        // var picUrl = 'c:/sony'
        
        rest.post(path, text)
        // .then((response)=>{alert('Help is On The Way')})
        // .catch(alert('Unable To Send Help'));


       
    }

    async componentDidMount() {
        //location with getcurrentpos
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const responseSuccess = await this.assignCoordinate(position.coords.latitude, position.coords.longitude) 
              if (responseSuccess) {
                var LOC = {
                  lat: this.state.latitude ,
                  lng: this.state.longitude,
                };
                Geocoder.geocodePosition(LOC).then(res => {
                  this.setState({
                    // address: res[0].namaAttribute,
                    // address: res[0].postalCode,
                    address: res[0].formattedAddress,
                  });
                })
                .catch(err => console.log(err));
              }
            } catch (e) {
              console.log(e)
            }
          },
          (error) => this.setState({ error: error.message }),
          { timeout: 20000, maximumAge: 1000 },
        );
        try {
         
          const valueIP = await AsyncStorage.getItem('@MyVAlue:isiPesan');
          const valueAE = await AsyncStorage.getItem('@MyVAlue:alamatEmail');
          const value = await AsyncStorage.getItem('@MyVAlue:nomorTelepon');
          const valueTE = await AsyncStorage.getItem('@MyValue:tujuanEmail');
          // const valueAT = await AsyncStorage.getItem('@MyVAlue:authToken');
          // const valueATS = await AsyncStorage.getItem('@MyVAlue: authTokenSecret');
      
          
          if (value !== null){
            // We have data!!
            console.log(value);
            this.setState({nomorTelepon:value})
            this.setState({isiPesan:valueIP})
            this.setState({alamatEmail:valueAE})
            this.setState({tujuanEmail:valueTE})
            // this.setState({authToken:valueAT})
            // this.setState({authTokenSecret:valueATS})
          }
        } catch (error) {
          // Error retrieving data
        }
      }
    
    assignCoordinate(lat, lng) {
        try {
          this.setState({
            latitude: lat,
            longitude: lng,
            error: null,
          })
          return true
        } catch (e) {
          return false
        }
      }
    
      
      // handleEmail = () => {
      //   Mailer.mail({
      //     subject: 'PressIt',
      //     recipients: [(this.state.alamatEmail)],
      //     ccRecipients: [''],
      //     bccRecipients: [''],
      //     body: this.state.isiPesan+' https://www.google.com/maps/search/?api=1&query='+this.state.latitude+','+this.state.longitude,
      //     isHTML: true,
      //     attachment: {
      //       path: '',  // The absolute path of the file from which to read data.
      //       type: '',   // Mime Type: jpg, png, doc, ppt, html, pdf
      //       name: '',   // Optional: Custom filename for attachment
      //     }
      //   }, (error, event) => {
      //     Alert.alert(
      //       error,
      //       event,
      //       [
      //         {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
      //         {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
      //       ],
      //       { cancelable: true }
      //     )
      //   });


      async sendMail() {
        try {
          await MailCompose.send({
            toRecipients: ['Gilbert.baldwinz@gmail.com'],
            ccRecipients: [''],
            bccRecipients: [''],
            subject: 'PressIt',
            text:this.state.isiPesan+' https://www.google.com/maps/search/?api=1&query='+this.state.latitude+','+this.state.longitude ,
            html: this.state.isiPesan+' https://www.google.com/maps/search/?api=1&query='+this.state.latitude+','+this.state.longitude, // Or, use this if you want html body. Note that some Android mail clients / devices don't support this properly.
            attachments: [{
              filename: 'mytext', // [Optional] If not provided, UUID will be generated.
              ext: '.txt',
              mimeType: 'text/plain',
              text: 'Hello my friend', // Use this if the data is in UTF8 text.
              data: '...BASE64_ENCODED_STRING...', // Or, use this if the data is not in plain text.
            }],
          });
        } catch (e) {
          // e.code may be 'cannotSendMail' || 'cancelled' || 'saved' || 'failed'
        }
      }
      //   var mailgun = require('mailgun.js');
      //   var mg = mailgun.client({
      //     username: 'PressIt',
      //     key: 'key-e85d4eef6ee6ef4ce0334601176b2a36',
      //     public_key: 'pubkey-b7755bd8c784f48d2e0c7bafa25ba67b'
      //   });

      //   mg.messages.create('sandbox94631b81fa15436ca93ccc71ea4d4f62.mailgun.org', {
      //     from: "gilbert.baldwinz@gmail.com",
      //     to: ["keanu.razgriz@gmail.com"],
      //     subject: "Hello",
      //     text: "Testing some Mailgun awesomness!",
      //     html: "<h1>Testing some Mailgun awesomness!</h1>"
      //   })
      //   .then(msg => console.log(msg)) // logs response data
      //   .catch(err => console.log(err)); // logs any error
      

     
       sendSMSFunction() {
      
       SmsAndroid.sms(
          this.state.nomorTelepon, // phone number to send sms to
          this.state.isiPesan+' https://www.google.com/maps/search/?api=1&query='+this.state.latitude+','+this.state.longitude, // sms body
          'sendDirect', // sendDirect or sendIndirect
          (err, message) => {
            if (err){
              console.log("error");
            } else {
              console.log(message); // callback message
            }
          }
        );
          }

          
        
    async phoneCall(){
    try {
       await SendIntentAndroid.sendPhoneCall(this.state.nomorTelepon);
    } catch (e) {

    }  
  
  }

    sendSMS(){
      var SendIntentAndroid = require('react-native-send-intent');
      SendIntentAndroid.sendSms('+6287875797525', 'abcd');
     }

    //  facebookLogin(){
    //     const FBSDK = require('react-native-fbsdk');
    //     const {
    //       LoginButton,
    //       AccessToken 
    //     } = FBSDK;
    //   }
  

    // shareLinkWithShareDialog() {
    //   const shareLinkContent = {
    //     contentType: 'link',
    //     contentUrl: "https://facebook.com",
    //     contentDescription: 'Wow, check out this great site!',
    //   };
    //   var tmp = this;
    //   ShareDialog.canShow(this.state.shareLinkContent).then(
    //     function(canShow) {
    //       if (canShow) {
    //         return ShareDialog.show(tmp.state.shareLinkContent);
    //       }
    //     }
    //   ).then(
    //     function(result) {
    //       if (result.isCancelled) {
    //         alert('Share cancelled');
    //       } else {
    //         alert('Share success with postId: '
    //           + result.postId);
    //       }
    //     },
    //     function(error) {
    //       alert('Share fail with error: ' + error);
    //     }
    //   );
    // }

    render(){
      const { navigate } = this.props.navigation;
      
        return (
            <View style={styles.container}>
              <View style={styles.posisiStatus}> 
              {/* <Text>Nomor Telepon Tersimpan : {this.state.phoneNumber}</Text> */}
              <Text style={{color:'white'}}>Nomor Telepon darurat:</Text>
              <Text style={{color:'white'}}>{this.state.nomorTelepon}</Text>
              <Text style={{color:'white'}}>Pesan darurat:</Text>
              <Text style={{color:'white'}}>{this.state.isiPesan}</Text>
              <Text style={{color:'white'}}>Lokasi:</Text>
              <Text style={{color:'white'}}>{this.state.address} </Text>
              </View>
                {/* <MultiTextInput 
                  multiline = {true}
                  numberOfLines = {4}
                  style = {styles.multilineText} 
                  placeholder="Twitter Message Here" 
                  onChangeText={(text)=>this.setState({text})
                }/> */}
                
                <View style={styles.posisitombolPressit}>
                <TouchableOpacity style = {styles.tombolPressit} onPress={()=>{this.sendMail();this.sendHelp();this.postToFacebook();this.sendSMSFunction();this.phoneCall()}}>
                <Image source={require('./image/PressIt.png')}/>
                </TouchableOpacity>
                </View>

               
                <View style={styles.posisitombolAkun}>
                <TouchableOpacity style = {styles.tombolAkun} onPress={()=> navigate('Account')}>
                <Image source={require('./image/tombolAkun.png')}/>

                </TouchableOpacity>
                </View>


                <View style={styles.posisitombolPesan}>
                <TouchableOpacity style = {styles.tombolPesan} onPress={()=> navigate('Message')}>
                <Image source={require('./image/tombolPesan.png')}/>
                </TouchableOpacity>
                </View>
            </View>
        )
    }
}

// class MultiTextInput extends Component {
//   render() {
//     return (
//       <TextInput
//         {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
//         editable = {true}
//         maxLength = {200}
//       />
//     );
//   }
// }

class tombolFunction extends Component{
  
}
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'dimgrey',
      alignItems: 'center',
      justifyContent: 'center'
  },
  posisiStatus:{
    paddingBottom: 10

  },


  posisitombolPressit: {
    justifyContent: 'center',
    paddingHorizontal: 100,
    paddingTop: 70
  },

  tombolPressit: {
    height: 170,
    width: 170,
    marginBottom:25,
  },

  posisitombolAkun: {
    justifyContent: 'center',
    paddingHorizontal: 55,
    paddingTop: 50
  },

  tombolAkun: {
    height: 70,
    width: 250,
  },

  posisitombolPesan: {
    justifyContent: 'center',
    paddingHorizontal: 55,
  },

  tombolPesan: {
    height: 70,
    width: 250,
  },
  
})

AppRegistry.registerComponent('RNSMS', () => RNSMS);