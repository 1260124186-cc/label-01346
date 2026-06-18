const app = getApp()
const { showToast, showSuccess, showError, showModal, formatDate, navigateTo } = require('../../utils/util')

Page({
  data: {
    myGroups: [],
    currentGroup: null,
    currentUserId: '',
    memberCount: 0,
    members: [],
    pointsPool: {
      total: 0,
      weekAdded: 0
    },
    inviteCode: '',
    isCurrentUserOwner: false,
    isCurrentUserAdmin: false,
    groupBadges: [],
    showCreateModal: false,
    showJoinModal: false,
    showRoleModal: false,
    createForm: {
      name: '',
      type: 'family'
    },
    joinForm: {
      inviteCode: ''
    },
    roleForm: {
      memberId: '',
      targetRole: 'member'
    }
  },

  onLoad() {
    console.log('[FamilyGroup] 页面加载')
    this.initUserId()
    this.loadGroupData()
  },

  onShow() {
    console.log('[FamilyGroup] 页面显示')
    this.loadGroupData()
  },

  initUserId() {
    const userInfo = app.globalData && app.globalData.userInfo
    if (userInfo && userInfo.id) {
      this.setData({ currentUserId: userInfo.id })
    } else {
      const userId = app.getUserId ? app.getUserId() : ''
      this.setData({ currentUserId: userId })
    }
  },

  loadGroupData() {
    const myGroups = app.getMyGroups ? app.getMyGroups() : []
    const currentGroup = app.getCurrentGroup ? app.getCurrentGroup() : null

    this.setData({
      myGroups: Array.isArray(myGroups) ? myGroups : [],
      currentGroup: currentGroup || null
    })

    if (currentGroup) {
      this.loadGroupDetails(currentGroup.id)
      this.checkUserRole(currentGroup)
    }
  },

  loadGroupDetails(groupId) {
    if (!groupId) return

    const members = app.getGroupMembers ? app.getGroupMembers(groupId) : []
    const pointsPool = app.getGroupPointsPool ? app.getGroupPointsPool(groupId) : { total: 0, weekAdded: 0 }
    const formattedMembers = this.formatMembers(members || [])
    const groupBadges = this.loadGroupBadges(groupId)

    this.setData({
      members: formattedMembers,
      memberCount: formattedMembers.length,
      pointsPool: {
        total: pointsPool.total || 0,
        weekAdded: pointsPool.weekAdded || 0
      },
      groupBadges
    })
  },

  loadGroupBadges(groupId) {
    const badgeIds = app.getGroupBadges ? app.getGroupBadges(groupId) : []
    if (badgeIds.length === 0) return []

    const { ACHIEVEMENTS } = require('../../utils/constants')
    return badgeIds.map(id => ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean)
  },

  onBadgeTap(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    navigateTo('/pages/achievement-detail/achievement-detail?id=' + id)
  },

  formatMembers(members) {
    const { currentUserId } = this.data
    return members.map(member => ({
      ...member,
      joinTimeText: member.joinTime ? formatDate(member.joinTime, 'YYYY-MM-DD') : '未知',
      isCurrentUser: member.id === currentUserId
    })).sort((a, b) => {
      const roleOrder = { owner: 0, admin: 1, member: 2 }
      const orderA = roleOrder[a.role] !== undefined ? roleOrder[a.role] : 3
      const orderB = roleOrder[b.role] !== undefined ? roleOrder[b.role] : 3
      if (orderA !== orderB) return orderA - orderB
      return (b.joinTime || 0) - (a.joinTime || 0)
    })
  },

  checkUserRole(group) {
    const { currentUserId } = this.data
    const members = app.getGroupMembers ? app.getGroupMembers(group.id) : []
    const currentMember = members.find(m => m.id === currentUserId)

    const role = currentMember ? currentMember.role : (group.creatorId === currentUserId ? 'owner' : 'member')
    const isOwner = role === 'owner' || group.creatorId === currentUserId
    const isAdmin = isOwner || role === 'admin'

    this.setData({
      isCurrentUserOwner: isOwner,
      isCurrentUserAdmin: isAdmin
    })
  },

  onSwitchGroup(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return

    if (app.setCurrentGroup) {
      app.setCurrentGroup(id)
      showSuccess('已切换组')
      this.loadGroupData()
    }
  },

  showCreateModal() {
    this.setData({
      showCreateModal: true,
      createForm: {
        name: '',
        type: 'family'
      }
    })
  },

  hideCreateModal() {
    this.setData({ showCreateModal: false })
  },

  showJoinModal() {
    this.setData({
      showJoinModal: true,
      joinForm: {
        inviteCode: ''
      }
    })
  },

  hideJoinModal() {
    this.setData({ showJoinModal: false })
  },

  hideRoleModal() {
    this.setData({ showRoleModal: false })
  },

  stopPropagation() {},

  onSelectType(e) {
    const { type } = e.currentTarget.dataset
    this.setData({
      'createForm.type': type
    })
  },

  onInputGroupName(e) {
    const value = e.detail.value || ''
    this.setData({
      'createForm.name': value.trim()
    })
  },

  onInputInviteCode(e) {
    let value = (e.detail.value || '').toUpperCase().trim()
    value = value.replace(/[^A-Z0-9]/g, '')
    this.setData({
      'joinForm.inviteCode': value
    })
  },

  onConfirmCreate() {
    const { name, type } = this.data.createForm

    if (!name || name.length < 2) {
      showError('组名称至少2个字符')
      return
    }

    if (name.length > 20) {
      showError('组名称不能超过20个字符')
      return
    }

    if (!type) {
      showError('请选择组类型')
      return
    }

    if (!app.createGroup) {
      showError('创建组功能暂不可用')
      return
    }

    try {
      const result = app.createGroup({ name, type })
      if (result) {
        showSuccess('组创建成功')
        this.hideCreateModal()
        setTimeout(() => {
          this.loadGroupData()
        }, 500)
      } else {
        showError('创建失败，请重试')
      }
    } catch (err) {
      console.error('[FamilyGroup] 创建组失败', err)
      showError('创建失败，请重试')
    }
  },

  onConfirmJoin() {
    const { inviteCode } = this.data.joinForm

    if (!inviteCode || inviteCode.length !== 6) {
      showError('请输入6位邀请码')
      return
    }

    if (!app.joinGroupByCode) {
      showError('加入组功能暂不可用')
      return
    }

    try {
      const result = app.joinGroupByCode(inviteCode)
      if (result) {
        showSuccess('加入成功')
        this.hideJoinModal()
        setTimeout(() => {
          this.loadGroupData()
        }, 500)
      } else {
        showError('邀请码无效或已过期')
      }
    } catch (err) {
      console.error('[FamilyGroup] 加入组失败', err)
      showError('加入失败，请检查邀请码')
    }
  },

  onGenerateInviteCode() {
    const { currentGroup, isCurrentUserAdmin } = this.data

    if (!currentGroup) {
      showError('请先选择组')
      return
    }

    if (!isCurrentUserAdmin) {
      showError('只有管理员可以生成邀请码')
      return
    }

    if (!app.generateInviteCode) {
      showError('生成邀请码功能暂不可用')
      return
    }

    try {
      const code = app.generateInviteCode(currentGroup.id)
      if (code) {
        this.setData({ inviteCode: code.toUpperCase() })
        showSuccess('邀请码已生成')
      } else {
        showError('生成失败，请重试')
      }
    } catch (err) {
      console.error('[FamilyGroup] 生成邀请码失败', err)
      showError('生成失败，请重试')
    }
  },

  onCopyInviteCode() {
    const { inviteCode } = this.data
    if (!inviteCode) {
      showError('暂无邀请码')
      return
    }

    wx.setClipboardData({
      data: inviteCode,
      success: () => {
        showSuccess('邀请码已复制')
      },
      fail: () => {
        showError('复制失败')
      }
    })
  },

  onShowRoleMenu(e) {
    const { id, role } = e.currentTarget.dataset
    if (!id) return

    this.setData({
      showRoleModal: true,
      roleForm: {
        memberId: id,
        targetRole: role === 'owner' ? 'admin' : (role || 'member')
      }
    })
  },

  onSelectRole(e) {
    const { role } = e.currentTarget.dataset
    this.setData({
      'roleForm.targetRole': role
    })
  },

  onConfirmRole() {
    const { currentGroup, roleForm, isCurrentUserOwner } = this.data
    const { memberId, targetRole } = roleForm

    if (!currentGroup || !memberId) {
      showError('参数错误')
      return
    }

    if (!isCurrentUserOwner && targetRole === 'admin') {
      showError('只有创建者可设置管理员')
      return
    }

    if (!app.updateMemberRole) {
      showError('角色更新功能暂不可用')
      return
    }

    try {
      const result = app.updateMemberRole(currentGroup.id, memberId, targetRole)
      if (result) {
        showSuccess('角色已更新')
        this.hideRoleModal()
        setTimeout(() => {
          this.loadGroupDetails(currentGroup.id)
        }, 300)
      } else {
        showError('更新失败，请重试')
      }
    } catch (err) {
      console.error('[FamilyGroup] 更新角色失败', err)
      showError('更新失败，请重试')
    }
  },

  onRemoveMember(e) {
    const { id, name } = e.currentTarget.dataset
    const { currentGroup } = this.data

    if (!id || !currentGroup) return

    showModal({
      title: '移除成员',
      content: `确定要移除「${name || '该成员'}」吗？\n移除后将无法撤销。`,
      confirmText: '移除',
      confirmColor: '#FF3B30'
    }).then(confirmed => {
      if (!confirmed) return

      if (!app.removeMember) {
        showError('移除成员功能暂不可用')
        return
      }

      try {
        const result = app.removeMember(currentGroup.id, id)
        if (result) {
          showSuccess('已移除成员')
          setTimeout(() => {
            this.loadGroupDetails(currentGroup.id)
          }, 300)
        } else {
          showError('移除失败，请重试')
        }
      } catch (err) {
        console.error('[FamilyGroup] 移除成员失败', err)
        showError('移除失败，请重试')
      }
    })
  },

  onLeaveOrDismiss() {
    const { currentGroup, isCurrentUserOwner } = this.data

    if (!currentGroup) return

    if (isCurrentUserOwner) {
      this.onDismissGroup()
    } else {
      this.onLeaveGroup()
    }
  },

  onLeaveGroup() {
    const { currentGroup } = this.data

    showModal({
      title: '退出组',
      content: `确定要退出「${currentGroup.name}」吗？\n退出后需重新通过邀请码加入。`,
      confirmText: '退出',
      confirmColor: '#FF9500'
    }).then(confirmed => {
      if (!confirmed) return

      if (!app.leaveGroup) {
        showError('退出组功能暂不可用')
        return
      }

      try {
        const result = app.leaveGroup(currentGroup.id)
        if (result) {
          showSuccess('已退出组')
          this.setData({ inviteCode: '' })
          setTimeout(() => {
            this.loadGroupData()
          }, 500)
        } else {
          showError('退出失败，请重试')
        }
      } catch (err) {
        console.error('[FamilyGroup] 退出组失败', err)
        showError('退出失败，请重试')
      }
    })
  },

  onDismissGroup() {
    const { currentGroup, members } = this.data

    const extraTip = members.length > 1 ? `\n组内还有 ${members.length} 名成员，解散后将全部移除。` : ''

    showModal({
      title: '解散组',
      content: `确定要解散「${currentGroup.name}」吗？${extraTip}\n解散后无法恢复！`,
      confirmText: '确认解散',
      confirmColor: '#FF3B30'
    }).then(confirmed => {
      if (!confirmed) return

      if (!app.dismissGroup) {
        showError('解散组功能暂不可用')
        return
      }

      try {
        const result = app.dismissGroup(currentGroup.id)
        if (result) {
          showSuccess('组已解散')
          this.setData({ inviteCode: '' })
          setTimeout(() => {
            this.loadGroupData()
          }, 500)
        } else {
          showError('解散失败，请重试')
        }
      } catch (err) {
        console.error('[FamilyGroup] 解散组失败', err)
        showError('解散失败，请重试')
      }
    })
  },

  onPullDownRefresh() {
    console.log('[FamilyGroup] 下拉刷新')
    this.loadGroupData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 800)
  }
})
