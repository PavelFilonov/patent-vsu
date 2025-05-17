import React from 'react'
import {shallow} from 'enzyme'
import {Button} from 'antd'
import SimpleControlLink from './SimpleControlLink'

describe('SimpleControlLink test', () => {
    const props = {
        label: 'AAA',
        onClick: jest.fn()
    }
    const wrapper = shallow(<SimpleControlLink {...props} />)
    it('should be rendered', () => {
        expect(wrapper.find(Button).findWhere(i => i.text() === props.label).length).toEqual(1)
    })
    it('should be clickable', () => {
        const spy = jest.spyOn(props, 'onClick')
        wrapper.find(Button).simulate('click')
        expect(spy).toHaveBeenCalled()
        spy.mockRestore()
    })
})
