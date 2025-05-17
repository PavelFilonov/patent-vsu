import React from 'react'
import {shallow} from 'enzyme'
import {DrilldownLink} from '../DrilldownLink'

describe('DrilldownLink test', () => {
    const drilldownProps = {
        onDrillDown: jest.fn(),
        children: {
            props: {
                children: 'Management & Organization'
            }
        }
    }
    const drilldownSpy = jest.spyOn(drilldownProps, 'onDrillDown')
    const wrapper = shallow(<DrilldownLink onDrillDown={drilldownProps.onDrillDown}>{drilldownProps.children}</DrilldownLink>)
    it('should be rendered', () => {
        expect(wrapper.find('div').findWhere(i => i.text() === drilldownProps.children.props.children)).toBeTruthy()
    })

    it('should call onDrillDown', () => {
        wrapper.find('.actionLink').simulate('click')
        expect(wrapper.find('.actionLink').length).toEqual(1)
        expect(drilldownSpy).toHaveBeenCalled()
        drilldownSpy.mockRestore()
    })

    it('should not be clickable', () => {
        const wrapper1 = shallow(<DrilldownLink>{drilldownProps.children}</DrilldownLink>)
        expect(wrapper1.find('.actionLink').length).toEqual(0)
    })
})
