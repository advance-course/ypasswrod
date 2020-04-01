import Taro, { useState, useEffect, navigateTo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { queryCategoryListApi, delCategoryApi } from '../api'
import { UserInfo } from 'pages/Auth/interface';
import './index.scss'
import { AtButton } from 'taro-ui';

export default function List () {

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo)

  useEffect(() => {
    Taro.getStorage({ key: 'userInfo' }).then(res => {
      setUserInfo(res.data)
    })
  }, [])

  useEffect(() => {
    if (loading) {
      fetchList().then(res => {
        setLoading(false)
        setList(res.data.data)
      })
    }
  }, [loading])

  function fetchList () {
    return queryCategoryListApi({
      userID: userInfo._id
    })
  }

  function handleDel (item) {
    delCategoryApi({
      userID: userInfo._id,
      _id: item._id
    }).then(res => {
      if (res.success) {
        Taro.showToast({title: '删除成功', duration: 1000 })
        setLoading(true)
      }
    })
  }

  function handleEdit (type, item) {
    let url = `/pages/Category/Edit/index?type=${type}`
    switch (type) {
      case 'add':
        break;
      case 'edit':
        url = `${url}&_id=${item._id}&userID=${userInfo._id}`
        break;
    }
    console.log('url', url)
    Taro.navigateTo({
      url: url
    })
  }

  return (
    <View className="container">
    <AtButton className="btn-add" type='secondary' onClick={() => handleEdit('add', null)}>添加分类</AtButton>
    {list.map((item) => (
        <View key={item._id} className="item">
          <Image src={item.imgUrl} className="img" />
          <Text className="name">{item.name}</Text>
          <AtButton type='secondary' size='small' onClick={() => handleEdit('edit', item)}>编辑</AtButton>
          <AtButton type='secondary' size='small' onClick={() => handleDel(item)}>删除</AtButton>
        </View>
      )
    )}
    </View>
  )
}
