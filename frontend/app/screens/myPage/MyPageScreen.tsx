import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Platform,
  PermissionsAndroid, Pressable, TextInput
} from 'react-native';
import MyPageLayout from "./MyPageLayout";
import {myPageStyles} from "@/styles/myPageStyles";
import SettingContainer from "@/components/SettingContainer";
import memberApi from "@/apis/memberApi";
import {useSelector} from "react-redux";
import {styles} from "@/styles/styles";
import {locationIcon} from "@/assets/icons/icons";
import {SvgXml} from "react-native-svg";
import CameraImageModal from '@/components/modal/CameraImageModal';
import { launchImageLibrary, launchCamera } from "react-native-image-picker";

const imagePickerOption = {
  mediaType: 'photo',
  includeBase64: Platform.OS === 'android',
};

const MyPageScreen = ({navigation}:any) => {
  const settings = [
    {name: '계정 설정', goto: 'AccountSetting'},{name: '알림 설정', goto: 'AlarmSetting'},{name: '내 나눔 내역', goto: 'MyShare'},{name: '즐겨찾기 레시피', goto: 'MyFavorite'}, {name:'임시 회원가입용', goto: 'SignUp'}, {name: '유저페이지', goto: 'User'}
  ];
  const memberId = useSelector((state) => state.userReducer.memberId);
  const [user, setUser] = useState<any>();
  const [userProfile, setUserProfile] = useState('');
  const [nickname, setNickname] = useState('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [nickEditing, setNickEditing] = useState<boolean>(false);


  function goto(t: string){
    navigation.navigate(t)
  }

  useEffect(() => {
    !user && getUserDetail();
  });

  useEffect(() => {
    console.log(user);
  }, [user]);

  async function getUserDetail(){
    console.log(memberId);
    try {
      const res = await memberApi.memberDetail(memberId);
      if (res.status === 200) {
        console.log(res.data.data.memberInfo);
        setUser(res.data.data.memberInfo);
        setNickname(res.data.data.memberInfo.nickname);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const modalOpen = () => {
    setModalVisible(true);
  };

  const onPickImage = async res => {
    if (res.didCancel || !res) {
      return;
    }
    //console.log('PickImage', res);
    console.log('user: ', user);
    const memberId = user.memberId;
    const formData = new FormData();

    const image = {
      name: res.assets[0].fileName,
      type: res.assets[0].type,
      uri: res.assets[0].uri,
    };

    formData.append('profileImage', image);
    const apiResponse = await memberApi.changeProfile(memberId, formData);
    let newUser = user;
    newUser.profileImageUrl = apiResponse.data.data.profileImageUrl;
    setUser(newUser);
  };

  const onLaunchCamera = () => {
    launchCamera(imagePickerOption, onPickImage);
  };

  // 갤러리에서 사진 선택
  const onLaunchImageLibrary = () => {
    launchImageLibrary(imagePickerOption, onPickImage);
  };

  const saveNickname = async () => {
    console.log(nickname);
    console.log(user.memberId);
    const res = await memberApi.memberUpdate(user.memberId, nickname);
    if(res.status === 200){
      setNickEditing(false);
    }
  };

  const changeNickname = () => {
    setNickEditing(true);
  }

  return <>
    <MyPageLayout title="마이 페이지">
      <ScrollView style={{width: '100%'}}>
        <View style={[myPageStyles.infoContainer]}>
          <Pressable
            style={[myPageStyles.profileImage, {marginTop: 20}]}
            onPress={() => {
              modalOpen();
            }}
          >
            {
              user && <Image source={{uri: user.profileImageUrl}} style={{width: '100%', height: '100%', borderRadius: 100}}/>
            }
          </Pressable>
          <View style={[myPageStyles.profileInfo, {alignItems: 'center', marginTop: 10}]}>
              {nickEditing ?
                <View>
                  <TextInput
                    value={nickname}
                    onChangeText={(text) => setNickname(() => text)}
                    placeholder="새로운 닉네임을 입력하세요"
                  />
                  <Button title="저장" onPress={saveNickname} />
                </View>
              : <View>
                  <Text style={[styles.font, {fontSize: 36}]}>
                    {nickname}
                  </Text>
                </View>
            }

            <View style={[{flexDirection: 'row'}]}>
              <SvgXml
                xml={locationIcon}
                width={20}
                height={20}
              />
              <Text style={[styles.font, {color: 'grey', fontSize: 24}]}>서울 역삼동</Text>
            </View>
            <Button title="닉네임 수정" onPress={changeNickname}/>
            {/*<TouchableWithoutFeedback onPress={()=>console.log('수정')}>*/}
            {/*  <View>*/}
            {/*    <Text>수정</Text>*/}
            {/*  </View>*/}
            {/*</TouchableWithoutFeedback>*/}
          </View>
          <View style={[myPageStyles.profileRowContainer, {height: 100}]}>

          </View>
        </View>
        <View style={myPageStyles.optionsContainer}>
          {
            settings.map((i) => {
              return <React.Fragment key={`${i.goto}`}>
                  <SettingContainer name={i.name} goto={i.goto} optionFunc={goto}/>
                </React.Fragment>
            })
          }
        </View>
      </ScrollView>
    </MyPageLayout>
    <CameraImageModal
      visible={modalVisible}
      onClose={()=>setModalVisible(false)}
      onLaunchCamera={onLaunchCamera}
      onLaunchImageLibrary={onLaunchImageLibrary}/>
  </>
}

export default MyPageScreen;
