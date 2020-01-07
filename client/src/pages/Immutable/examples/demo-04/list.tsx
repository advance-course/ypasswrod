import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import Item from './item'

const List = (props: { list: Item[] }) => {
  console.log('render List')
  const itemStyle = {
    color: 'red'
  }
  const { list } = props
  return (
    <View>
      {list.map(item => <Item key={item.id} item={item} style={itemStyle} />)}
    </View>
  )
}
// export default List
export default Taro.memo(List)