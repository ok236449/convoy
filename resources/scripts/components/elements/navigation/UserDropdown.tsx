import { Avatar, Menu } from '@mantine/core'
import { useStoreState } from '@/state'
import { getInitials } from '@/util/helpers'

const UserDropdown = () => {
  const user = useStoreState((state) => state.user.data!)

  return (
    <Menu width={175} shadow='lg'>
      <Menu.Target>
        <button className='flex items-center space-x-3 bg-transparent ring-transparent rounded-sm ring-4 hover:ring-stone-100 dark:hover:ring-stone-900 hover:bg-stone-100 dark:hover:bg-stone-900 transition'>
          <p className='text-auto font-medium text-sm'>{user.name}</p>
          <Avatar color='blue' size='md' radius='xl'>
            {getInitials(user.name)}
          </Avatar>
        </button>
      </Menu.Target>

      <Menu.Dropdown>
        {/* {auth.user.root_admin && route().current('admin.*') ? (
        <Menu.Item
          onClick={() => Inertia.visit(route('dashboard'))}
        >
          Switch to Client
        </Menu.Item>
      ) : (
        ''
      )}
      {auth.user.root_admin && !route().current('admin.*') ? (
        <Menu.Item
          onClick={() =>
            Inertia.visit(route('admin.dashboard'))
          }
        >
          Switch to Admin
        </Menu.Item>
      ) : (
        ''
      )}{' '}
        <Menu.Divider /> */}
        <Menu.Item color='red'>Log Out</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default UserDropdown
