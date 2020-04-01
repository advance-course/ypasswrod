import Taro, {useState, useEffect} from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtList, AtInput, AtButton } from 'taro-ui';
import LogoSelect from "components/LogoSelect";
import { addCategoryApi, queryTheCategoryApi, updateCategoryApi } from '../api'
import { UserInfo } from 'pages/Auth/interface';
export default function Category() {
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo)

  const _params = this.$router.params

  console.log('_______params', _params)

  const [params, setParams] = useState({
    name: '',
    imgUrl: '',
    userID: ''
  })

  useEffect(() => {
    Taro.getStorage({ key: 'userInfo' }).then(res => {
      setUserInfo(res.data)
    })
  }, [])

  useEffect(() => {
    if (_params.type === 'edit') {
      handleQuery().then(res => {
        let item = res.data.data[0]
        setParams(item)
      })
    }
  }, [])

  function handleQuery () {
    return queryTheCategoryApi({
      _id: _params._id,
      userID: _params.userID
    })
  }

  function handleSelectImage(select: any) {
    // console.log("=========", select);
    setParams({
      ...params,
      imgUrl: select.url
    })
  }

  function addCategory () {
    //同步设置
    params.userID = userInfo._id

    Taro.showLoading({
      title: '正在提交...',
      mask: true
    })

    console.log('----> add func')

    if (_params.type === 'edit') {
      console.log('修改分类-->')
      updateCategoryApi(params).then(res => {
        Taro.hideLoading()
        if (res.success) {
          Taro.showToast({title: '更新成功', duration: 1000 })
          Taro.navigateBack()
        }
      }).catch(err => {
        Taro.hideLoading()
        console.log(err)
      })
    } else {
      addCategoryApi(params).then((res) => {
        Taro.hideLoading()
        if (res.success) {
          Taro.showToast({title: '添加成功', duration: 1000 })
          Taro.navigateBack()
        }
      }).catch(err => {
        Taro.hideLoading()
        console.log(err)
      })
    }
  }

  return (
    <View className="container">
      <AtList>
        <AtInput
          name="name"
          title="名称"
          onChange={(v: string) => {
            setParams({...params, name: v})
          }}
        ></AtInput>
        <Image
          className="image"
          src={params.imgUrl}
          mode='widthFix'>
        </Image>
        <LogoSelect title="选择logo" selectText="选择logo按钮" onSelectCallback={handleSelectImage} />
      </AtList>
      <View className="btnView">
        <AtButton className="add_btn" onClick={addCategory}>新增分类</AtButton>
      </View>
    </View>
  )
}

Category.config = {
  "navigationBarTitleText": "类别"
}
