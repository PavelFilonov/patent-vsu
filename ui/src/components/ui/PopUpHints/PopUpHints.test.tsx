import React from 'react'
import {shallow} from 'enzyme'
import PopUp from './PopUpHints'

describe('PopUp test', () => {
    const props = {
        hints: ['row1', 'row2']
    }
    it('should be rendered', () => {
        const component = shallow(<PopUp {...props} placement="bottom" />)
        const wrapper = component.find('Popover').findWhere(i => i.props().placement === 'bottom')
        expect(wrapper.length).toBe(1)
    })
    it('should not be rendered', () => {
        const component = shallow(<PopUp placement="bottom" />)
        const wrapper = component.find('Popover').findWhere(i => i.props().placement === 'bottom')
        expect(wrapper.length).toBe(0)
    })
})
