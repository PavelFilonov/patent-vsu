import {DataItem} from '@tesler-ui/core/interfaces/data'
import FileSaver from 'file-saver'
import {Cell, Column} from 'exceljs'
import {Button, Icon, notification} from 'antd'
import React from 'react'
import styles from './exportXlsx.less'
import {SmField} from '../interfaces/widget'
import valueMapper from './exportValueMapper'
import {DocumentType} from '../constants'

/**
 * Max length of cell (chars)
 */
const maxLength = 33
/**
 * Min length of cell (chars)
 */
const minLength = 10

/**
 * Creates xlsx document and downloads it to device
 *
 * @param items
 * @param bcName
 * @param fileName
 * @param fields
 * @param title
 */
async function exportXlsx(items: DataItem[], bcName: string, fileName: string, fields: SmField[], title: string) {
    const ExcelJS = await import('exceljs')
    const workbook1 = new ExcelJS.Workbook()
    const sheet1 = workbook1.addWorksheet('Sheet1')

    // set titles
    sheet1.columns = fields.map(i => {
        return {
            outlineLevel: null,
            hidden: null,
            style: null,
            values: null,
            letter: null,
            number: null,
            worksheet: null,
            isCustomWidth: null,
            headers: null,
            isDefault: null,
            headerCount: null,
            equivalentTo: null,
            collapsed: null,
            eachCell: null,
            defn: null,
            header: i.title || i.label,
            key: i.key
        }
    })

    // set style of header row
    sheet1.findRow(1).eachCell((cell: Cell) => {
        cell.border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
        }
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: '959595'
            }
        }
    })
    sheet1.findRow(1).font = {
        bold: true
    }

    // add rows with data
    items.forEach(item => {
        const row = sheet1.columns.map((col: Column) =>
            valueMapper(
                item[col.key],
                fields.find(i => i.key === col.key)
            )
        )
        sheet1.addRow(row)
    })

    // set columns width depend on data width
    sheet1.columns = sheet1.columns.map((column: Column) => {
        return {
            ...column,
            width: setWidth(column)
        }
    })

    // set style for data rows
    for (let i = 2; i <= sheet1.rowCount; i++) {
        sheet1.findRow(i).eachCell((cell: Cell) => {
            cell.style = {
                alignment: {
                    wrapText: true,
                    horizontal: 'left',
                    vertical: 'top'
                }
            }
        })
    }

    // save fine to device
    workbook1.xlsx.writeBuffer().then((buffer: Buffer) => {
        const blob = new Blob([buffer], {type: 'application/octet-stream'})
        const handleDownload = () => FileSaver.saveAs(blob, `${fileName}.xlsx`, false)
        notification.open({
            key: `open${Date.now()}`,
            duration: 0,
            className: styles.notification,
            btn: (
                <Button type="link" onClick={handleDownload}>
                    Download
                </Button>
            ),
            icon: <Icon type="check-circle" style={{color: '#25B220'}} />,
            message: `${title} Grid ${DocumentType.xlsx} is ready`
        })
    })
}
export default exportXlsx

function setWidth(column: Column) {
    const allValuesWidths = column.values
        .map(i => {
            return i.toString().length
        })
        .filter(i => !!i)
    const maxWidth = Math.max(...allValuesWidths)
    if (maxWidth > maxLength) {
        return maxLength
    }
    return maxWidth < minLength ? minLength : maxWidth
}
