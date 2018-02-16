import React, { Component } from 'react';
import {
    AsyncStorage,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  NativeModules,
} from 'react-native';

import Icon from "react-native-vector-icons/Ionicons"

const { RNTwitterSignIn } = NativeModules

const config =  {
  twitter: {
    consumer_key: 'lQIgRGASAc27nYqCKdSCH3zm8',
    consumer_secret: 'bzquAPIucZDoIJMc4l1RjtiEhZgKiHN7Qfd7tvcqKHHjRLNGDa'
  },
  
}

// const manager = new OAuthManager('testgilbert')
// manager.configure(config);

  
   
const Constants = {
  TWITTER_COMSUMER_KEY: "lQIgRGASAc27nYqCKdSCH3zm8",
  TWITTER_CONSUMER_SECRET: "bzquAPIucZDoIJMc4l1RjtiEhZgKiHN7Qfd7tvcqKHHjRLNGDa"
}

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
  ShareDialog,
  ShareApi
} = FBSDK;


export default class AccountPage extends Component {
    constructor(props) {
        super(props);
        const shareLinkContent = {
          contentType: 'link',
          contentUrl: 'https://www.facebook.com/',
        };

        this.state = {
            nomorTelepon : '',
            facebookAPI: '',
            isLoggedIn: false,
            shareLinkContent: shareLinkContent,  
            tujuanEmail : '',
            // authToken:'',
            // authTokenSecret:'',  
        };
    }
    static navigationOption = {
        title: 'Account',
    };

    async handleSave(value){
        try {
            await AsyncStorage.setItem('@MyVAlue:nomorTelepon', value);
            await AsyncStorage.setItem('@MyVAlue:alamatEmail', value);
            await AsyncStorage.setItem('@MyVAlue:tujuanEmail', value);
            // await AsyncStorage.setItem('@MyVAlue:authToken', value);
            // await AsyncStorage.setItem('@MyVAlue:authTokenSecret', value);
            console.log("BISA")
          } catch (error) {
              console.log(error)
            // Error saving data
          }
    }

    // handleGet(){
    //     try {
    //         const value = await AsyncStorage.getItem('@MySuperStore:key');
    //         if (value !== null){
    //           // We have data!!
    //           console.log(value);
    //         }
    //       } catch (error) {
    //         // Error retrieving data
    //       }
    // }

    // ShareApi.canShare(this.state.shareLinkContent).then(
    //     var tmp = this;
    //     function(canShare) {
    //       if (canShare) {
    //         return ShareApi.share(tmp.state.shareLinkContent, '/me', 'Some message.');
    //       }
    //     }
    //   ).then(
    //     function(result) {
    //       alert('Share operation with ShareApi was successful');
    //     },
    //     function(error) {
    //       alert('Share with ShareApi failed with error: ' + error);
    //     }
    //   );
    
    twitterSignIn = () => {
      RNTwitterSignIn.init(Constants.TWITTER_COMSUMER_KEY, Constants.TWITTER_CONSUMER_SECRET)
      RNTwitterSignIn.logIn()
        .then(loginData => {
          console.log(loginData)
          const { authToken, authTokenSecret } = loginData
          if (authToken && authTokenSecret) {
            this.setState({
              isLoggedIn: true
            })
          }
        })
        .catch(error => {
          console.log(error)
        }
      )
    }
  
    handleLogout = () => {
      console.log("logout")
      RNTwitterSignIn.logOut()
      this.setState({
        isLoggedIn: false
      })
    }

    shareLinkWithShareDialog() {
        var tmp = this;
        ShareApi.canShare(this.state.shareLinkContent).then(
          function(canShare) {
            if (canShare) {
              return ShareApi.share(tmp.state.shareLinkContent, '/me', 'Some message.');
            }
          }
        ).then(
          function(result) {
            alert('Share operation with ShareApi was successful');
          },
          function(error) {
            alert('Share with ShareApi failed with error: ' + error);
          }
        );
      }   

     
    // try{ 
    //   resp = await manager.authorize('twitter')
    // }catch(error){
    //   console.log(error)
    // }
    // {console.log(resp.status)
  
  
  
    render(){
        const { navigate } = this.props.navigation;
        const { isLoggedIn } = this.state
        return (
            <View style={styles.container}> 

            <View style={styles.posisitombolFacebook}>
            <LoginButton 
            publishPermissions={["publish_actions"]}
            onLoginFinished={
              (error, result) => {
                if (error) {
                  alert("login has error: " + result.error);
                } else if (result.isCancelled) {
                  alert("login is cancelled.");
                } else {
                  AccessToken.getCurrentAccessToken().then(
                    (data) => {data.accessToken.toString()}
                  )
                }
              }
            }
            onLogoutFinished={() => alert("logout.")}
            />
            </View>

            <View style={styles.posisitombolTwitter}>
            {/* <TouchableOpacity style = {styles.tombolTwitter} onPress={this.shareLinkWithShareDialog.bind(this)} 
            >
            <Image source={require('./image/tombolTwitter.png')}/>
            </TouchableOpacity> */}

              {isLoggedIn
          ? <TouchableOpacity onPress={this.handleLogout}>
              <Text>Log out</Text>
            </TouchableOpacity>
          : <Icon.Button name="logo-twitter" size={32} color="white" style={styles.icon} onPress={()=>{this.twitterSignIn();this.handleSave()}}>
              Terhubung Dengan Twitter
            </Icon.Button>}
            </View>
            
            <View style={styles.posisiInput}>
            <TextInput style={{color:'white'}} placeholder='Alamat Email yang dituju' onChangeText={(text)=>this.setState({tujuanEmail:text})}/>
            </View>
            <View style={styles.posisiSave}>
            <TouchableOpacity style = {styles.elseButton} onPress={()=> this.handleSave(this.state.tujuanEmail)
            .then((response)=>{alert('Pengaturan Email berhasil')})
            .catch(alert('Gagal mengatur email'))}>
            <Image source={require('./image/tombolSave.png')}/></TouchableOpacity>
            </View>

            <View style={styles.posisiInput}>
            <TextInput style={{color:'white'}} onChangeText={(text)=>this.setState({nomorTelepon:text})} placeholder='Nomor Telepon Darurat'/>
            </View>
            <View style={styles.posisiSave}>
            <TouchableOpacity style = {styles.elseButton} onPress={() => this.handleSave(this.state.nomorTelepon)
            .then((response)=>{alert('Pengaturan nomor telepon darurat berhasil')})
            .catch(alert('Gagal Menyimpan nomor'))}>
            <Image source={require('./image/tombolSave.png')}/>
            </TouchableOpacity>
            </View>
        

            <View style={styles.posisitombolMain}>
                <TouchableOpacity style = {styles.tombolMain} onPress={()=> navigate('MainAja')}>
                <Image source={require('./image/tombolMain.png')}/>
                </TouchableOpacity>
                </View>
              </View>
        
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'dimgrey',
    },

    posisiInput:{
paddingRight:30,
    },

    saveButton: {
        height: 30,
        backgroundColor: '#3F51B5'
    },

    posisiSave:{
        paddingLeft: 250,
    },

   facebookButton: {
        height: 30,
        marginBottom:5,
        backgroundColor: '#3F51B5'
      },

    twitterButton: {
        height: 30,
        marginBottom:5,
        backgroundColor: '#00BCD4'
      },

      elseButton:{
        height: 40,
        marginBottom:5,
      
      },

      buttonText: {
        color: '#ffffff',
        fontSize: 12,
        textAlign: 'center',
      },

      posisitombolMain: {
        justifyContent: 'center',
        paddingHorizontal: 55,
        paddingTop: 60,
      },
    
      tombolMain: {
        height: 70,
        width: 270,
      },

      posisitombolFacebook: {
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 20
      },
    
      tombolFacebook: {
        height: 80,
        width: 320,
      },
      posisitombolTwitter: {
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 50,
      },
    
      tombolTwitter: {
        height: 80,
        width: 320,
      },
  })