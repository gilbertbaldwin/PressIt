import React, { Component } from 'react';
import {
    AsyncStorage,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';


export default class MessageScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isiPesan : '',
        }
    }
    static navigationOption = {
        title: 'Message',
    };

    async handleSave(value){
        try {
            await AsyncStorage.setItem('@MyVAlue:isiPesan', value);
            console.log("BISA")
          } catch (error) {
              console.log(error)
            // Error saving data
          }
    }

   
//     facebookLogin(){
//      logInWithReadPermissions(['public-profile']),then(function(result) {
// if (result.isCancelled){
//   console.log('Login was cancelled');
// }else{
//   console.log('Login was a success' + result.grantedPermissions.toString());
// } 
// }, function(error){
//   console.log('An error occured:' + error);
// })
//      }     



    render(){
        const { navigate } = this.props.navigation;
        return (
            <View style= {styles.container}>
            
         <MultiTextInput 
                  multiline = {true}
                  numberOfLines = {2}
                  style = {styles.multilineText} 
                  placeholder="Tulis pesan yang ingin di kirim" 
                  onChangeText={(text)=>this.setState({isiPesan:text})}/>

                 <View style={styles.posisiSave}>
            <TouchableOpacity style = {styles.elseButton} onPress={() => this.handleSave(this.state.isiPesan)
              .then((response)=>{alert('Pesan Telah Disimpan')})
              .catch(alert('Gagal Menyimpan Pesan'))}>
              <Image source={require('./image/tombolSave.png')}/></TouchableOpacity>
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

class MultiTextInput extends Component {
    render() {
      return (
        <TextInput
          {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
          editable = {true}
          maxLength = {50}
        />
        
      )
      
    }
  }


      
         
    
const styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 20,
        backgroundColor: 'dimgrey'
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.7)',
        marginBottom: 20,
        color: '#fff',
        paddingHorizontal: 10
      
    },
    multilineText: {
        height: 50,
        marginBottom: 20,
        color: '#fff',
        paddingHorizontal: 10
    },
    posisitombolMain: {
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingTop: 250,
    
      },
    
      tombolMain: {
        height: 70,
        width: 270,
      },
      posisiSave:{
        paddingLeft: 210,
    },
    
    elseButton:{
        height: 40,
        marginBottom:5,
    
      },
  })