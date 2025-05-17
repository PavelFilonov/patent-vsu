import {DataItem} from '@tesler-ui/core/interfaces/data'
import {Document, Packer, PageOrientation, Paragraph, Table, TableCell, TableRow, TextRun} from 'docx'
import FileSaver from 'file-saver'
import {Button, Icon, notification} from 'antd'
import React from 'react'
import styles from './exportXlsx.less'
import {SmField} from '../interfaces/widget'
import valueMapper from './exportValueMapper'
import {DocumentType} from '../constants'

const paperWidth = 16838
const marginSize = 533
const maxWidth = paperWidth - marginSize * 2

function exportDocx(items: DataItem[], bcName: string, fileName: string, fields: SmField[], title: string) {
    // calculate column width
    const w = maxWidth / fields.length
    const colWidths = fields.map(() => w)
    const rows: TableRow[] = []

    // fill header row
    const headerRow = new TableRow({
        tableHeader: true,
        children: fields.map(field => {
            return new TableCell({
                shading: {
                    fill: '959595',
                    color: 'auto'
                },
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: field.title || field.label,
                                bold: true
                            })
                        ]
                    })
                ]
            })
        })
    })
    rows.push(headerRow)

    // fill table data
    items.forEach(item => {
        const row = new TableRow({
            children: fields.map(field => {
                return new TableCell({
                    children: [
                        new Paragraph(
                            valueMapper(
                                item[field.key],
                                fields.find(i => i.key === field.key)
                            )
                        )
                    ]
                })
            })
        })
        rows.push(row)
    })

    // create table
    const table = new Table({
        columnWidths: colWidths,
        rows
    })

    // create document
    const document = new Document({
        sections: [
            {
                properties: {
                    page: {
                        size: {
                            orientation: PageOrientation.LANDSCAPE
                        },
                        margin: {
                            left: marginSize,
                            right: marginSize
                        }
                    }
                },
                children: [table]
            }
        ]
    })

    // download document
    Packer.toBlob(document).then(blob => {
        const handleDownload = () => FileSaver.saveAs(blob, `${fileName}.docx`, false)
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
            message: `${title} Grid ${DocumentType.docx} is ready`
        })
    })
}

export default exportDocx
